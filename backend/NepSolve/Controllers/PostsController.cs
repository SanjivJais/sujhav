using System.Text.Json;
using System.Text;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;
using NepSolve.Data;
using NepSolve.Models.DTOs.Post;
using NepSolve.Models.Entities;
using NepSolve.Models.DTOs.Cluster;
using NepSolve.Models.DTOs.Groq;
using NepSolve.Models.DTOs.Cohere;
using System.Net.Http.Headers;

namespace NepSolve.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PostsController : ControllerBase
    {
        private readonly IMongoCollection<Post> _posts;
        private readonly IMongoCollection<Cluster> _clusters;

        private readonly HttpClient _httpClient;
        private readonly IConfiguration _configuration;
        private readonly IHttpContextAccessor _httpContextAccessor;
        public PostsController(MongoDbService dbService, HttpClient httpClient, IConfiguration configuration, IHttpContextAccessor httpContextAccessor)
        {
            _posts = dbService.Database?.GetCollection<Post>("posts");
            _clusters = dbService.Database?.GetCollection<Cluster>("clusters");
            _httpClient = httpClient;
            _configuration = configuration;
            _httpContextAccessor = httpContextAccessor;
        }

        // get posts by ids
        [HttpPost("get-posts-by-ids")]
        public async Task<IActionResult> GetPostsByIds([FromBody] List<string> postIds)
        {
            try
            {
                if (postIds == null || postIds.Count == 0)
                {
                    return BadRequest(new { message = "Invalid post IDs provided." });
                }

                var posts = await _posts.Find(p => postIds.Contains(p.Id)).ToListAsync();

                return Ok(posts);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Internal Server Error", error = ex.Message });
            }
        }


        [HttpGet("paginated")]
        public async Task<IActionResult> GetPostsWithPagination(
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 10
        )
        {
            try
            {
                if (page < 1 || pageSize < 1)
                {
                    return BadRequest(new { message= "Invalid pagination!" });
                }

                // Calculate the number of documents to skip
                int skip = (page - 1) * pageSize;

                // Get total post count
                long totalPosts = await _posts.CountDocumentsAsync(FilterDefinition<Post>.Empty);

                // Retrieve posts with pagination
                var posts = await _posts
                    .Find(FilterDefinition<Post>.Empty)
                    .SortByDescending(p => p.CreatedAt) // Latest posts first
                    .Skip(skip)
                    .Limit(pageSize)
                    .ToListAsync();

                // Create response with pagination metadata
                var response = new
                {
                    TotalPosts = totalPosts,
                    TotalPages = (int)Math.Ceiling((double)totalPosts / pageSize),
                    CurrentPage = page,
                    PageSize = pageSize,
                    Posts = posts
                };

                return Ok(response);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = "An error occurred.", Error = ex.Message });
            }
        }


        [HttpGet("{id}")]
        public async Task<IActionResult> GetPost([FromRoute] string id)
        {
            try
            {
                var post = await _posts.Find(p => p.Id == id).FirstOrDefaultAsync();
                if (post == null)
                    return NotFound(new { message = "Post not found." });
                return Ok(post);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Internal Server Error", error = ex.Message });
            }
        }


        [HttpPost]
        [Authorize]
        public async Task<IActionResult> CreatePost([FromBody] PostCreateDTO postRequest)
        {
            try
            {
                if(postRequest.Content.Length<10)
                {
                    return BadRequest(new { message = "Post content should be at least 10 characters long!" });
                }
                if (postRequest.User == null)
                {
                    return BadRequest(new { message = "Something went wrong, please try again!" });
                }
                if (postRequest.Regions.Count < 1)
                {
                    return BadRequest(new { message = "Please select at least one region!" });
                }
                if (postRequest.Regions.Count > 3)
                {
                    return BadRequest(new { message = "You can select up to 3 regions!" });
                }
                if (postRequest.Embedding == null)
                {
                    return BadRequest(new { message = "Your post couldn't be processed properly, please try again!" });
                }

                // Create a new post
                var post = new Post
                {
                    User = postRequest.User,
                    Content = postRequest.Content,
                    Regions = postRequest.Regions,
                    Embedding = postRequest.Embedding
                };

                // Insert the post
                await _posts.InsertOneAsync(post);


                // clustering logic

                // 1. Get semantically appropriate clusters
                // Call FindSemanticClusters
                var clusters = await FindClustersAsync(postRequest.Embedding);

                if (clusters.Count > 0) {
                    clusters = clusters.OrderByDescending(c => c.Similarity).ToList();
                    var topCluster = clusters.First();

                    // Step 2: Fetch all posts in the existing cluster
                    var existingPostIds = topCluster.Posts;
                    var postsResponse = await _httpClient.PostAsJsonAsync($"{_configuration["BACKEND_BASE_URL"]}/api/posts/get-posts-by-ids", existingPostIds);

                    if (!postsResponse.IsSuccessStatusCode)
                        return StatusCode(500, new { message = "Failed to fetch existing posts.", error = "Internal server error." });

                    var existingPosts = await postsResponse.Content.ReadFromJsonAsync<List<Post>>();
                    var allContents = existingPosts.Select(p => p.Content).ToList();
                    allContents.Add(postRequest.Content); // Add new post content

                    // Step 3: Generate new summary using all contents
                    var summaryResponse = await GetPostsSummary(string.Join(" ", allContents));

                    if (summaryResponse == null)
                        return StatusCode(500, new { message = "Failed to summarize the cluster.", error = "Internal server error." });

                    // Step 4: Generate new embedding for the updated summary
                    var summaryEmbedding = await GetTextEmbedding(new List<string> { summaryResponse.ClusterSummary });

                    if (summaryEmbedding == null)
                        return StatusCode(500, new { message = "Failed to create summary embedding.", error = "Internal server error." });

                    // Step 5: Update the existing cluster
                    var updatedCluster = new ClusterUpdateDTO
                    {
                        ClusterSummary = summaryResponse.ClusterSummary,
                        SummaryEmbedding = summaryEmbedding,
                        Posts = existingPostIds.Append(post.Id).ToList(), // Add new post ID
                        Regions = topCluster.Regions.Union(postRequest.Regions).ToList(), // Merge unique regions
                        UpdatedAt = DateTime.UtcNow
                    };

                    var updateDefinition = Builders<Cluster>.Update
                        .Set(c => c.UpdatedAt, updatedCluster.UpdatedAt)
                        .Set(c => c.ClusterSummary, updatedCluster.ClusterSummary)
                        .Set(c => c.SummaryEmbedding, updatedCluster.SummaryEmbedding)
                        .Set(c => c.Posts, updatedCluster.Posts)
                        .Set(c => c.Regions, updatedCluster.Regions);

                    await _clusters.UpdateOneAsync(
                        Builders<Cluster>.Filter.Eq(c => c.Id, topCluster.Id),
                        updateDefinition
                    );
                }
                else
                {
                    // 2. Create a new cluster

                    // get topic and summary for the post
                    var summaryResponse = await GetPostsSummary(postRequest.Content);

                    if (summaryResponse == null)
                    {
                        return StatusCode(500, new { message = "Failed to summarize the post.", error = "Internal server error." });
                    }

                    // get summary embedding
                    var summaryEmbedding = await GetTextEmbedding(new List<string> { summaryResponse.ClusterSummary });
                    
                    if (summaryEmbedding == null)
                    {
                        return StatusCode(500, new { message = "Failed to create summary embedding.", error = "Internal server error." });
                    }

                    var clusterRequest = new ClusterCreateDTO
                    {
                        Topic = summaryResponse.Topic,
                        ClusterSummary = summaryResponse.ClusterSummary,
                        SummaryEmbedding = summaryEmbedding,
                        Posts = new List<string> { post.Id },
                        Regions = postRequest.Regions
                    };

                    var token = _httpContextAccessor.HttpContext?.Request.Headers["Authorization"].ToString();
                    if(string.IsNullOrEmpty(token))
                        return Unauthorized(new { message = "Unauthorized access." });

                    var jsonContent = new StringContent(JsonSerializer.Serialize(clusterRequest), Encoding.UTF8, "application/json");


                    var request = new HttpRequestMessage(HttpMethod.Post, $"{_configuration["BACKEND_BASE_URL"]}/api/clusters/create")
                    {
                        Content = jsonContent
                    };
                    request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", token.Replace("Bearer ", ""));
                    var response = await _httpClient.SendAsync(request);
                                       
                    if (!response.IsSuccessStatusCode)
                        return StatusCode(500, new { message = "Failed to create a new cluster.", error = "Internal server error." });
                }
                return CreatedAtAction(nameof(GetPost), new { id = post.Id }, post);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Internal Server Error", error = ex.Message });
            }
        }


        // functions for clustering logic

        private async Task<List<SearchClusterResponseDTO>> FindClustersAsync(double[] embedding)
        {
            var jsonContent = new StringContent(JsonSerializer.Serialize(embedding), Encoding.UTF8, "application/json");

            var response = await _httpClient.PostAsync($"{_configuration["BACKEND_BASE_URL"]}/api/clusters/find-clusters", jsonContent);

            //if (!response.IsSuccessStatusCode)
            //    return null;

            var responseData = await response.Content.ReadAsStringAsync();
            return JsonSerializer.Deserialize<List<SearchClusterResponseDTO>>(responseData); // Adjust the type based on response structure
        }


        private async Task<GroqSummaryResponseDTO> GetPostsSummary(string content)
        {
            var token = _httpContextAccessor.HttpContext?.Request.Headers["Authorization"].ToString();

            if (string.IsNullOrEmpty(token))
                return null; // Or handle unauthorized case

            var jsonContent = new StringContent(JsonSerializer.Serialize(content), Encoding.UTF8, "application/json");

            var request = new HttpRequestMessage(HttpMethod.Post, $"{_configuration["BACKEND_BASE_URL"]}/api/ai/summarize")
            {
                Content = jsonContent
            };
            request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", token.Replace("Bearer ", ""));

            var response = await _httpClient.SendAsync(request);
            if (!response.IsSuccessStatusCode)
                return null;

            var responseData = await response.Content.ReadAsStringAsync();
            return JsonSerializer.Deserialize<GroqSummaryResponseDTO>(responseData);
        }

        private async Task<double[]> GetTextEmbedding(List<string> texts)
        {

            var token = _httpContextAccessor.HttpContext?.Request.Headers["Authorization"].ToString();
            if (string.IsNullOrEmpty(token))
                return null; // Or handle unauthorized case

            var jsonContent = new StringContent(JsonSerializer.Serialize(texts), Encoding.UTF8, "application/json");

            var request = new HttpRequestMessage(HttpMethod.Post, $"{_configuration["BACKEND_BASE_URL"]}/api/ai/embedding")
            {
                Content = jsonContent
            };
            request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", token.Replace("Bearer ", ""));

            var response = await _httpClient.SendAsync(request);

            if (!response.IsSuccessStatusCode)
                return null;

            var responseData = await response.Content.ReadAsStringAsync();

            // Deserialize directly into EmbeddingApiResponse
            var embeddingResponse = JsonSerializer.Deserialize<EmbeddingApiResponse>(responseData);
            if (embeddingResponse == null || embeddingResponse.Embeddings == null)
                return new double[0];  // Return empty array if something goes wrong
            return embeddingResponse.Embeddings;
        }

    }
}
