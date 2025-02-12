using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;
using NepSolve.Data;
using NepSolve.Models.DTOs.Post;
using NepSolve.Models.Entities;

namespace NepSolve.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PostsController : ControllerBase
    {
        private readonly IMongoCollection<Post> _posts;
        public PostsController(MongoDbService dbService)
        {
            _posts = dbService.Database?.GetCollection<Post>("posts");
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
                return CreatedAtAction(nameof(GetPost), new { id = post.Id }, post);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Internal Server Error", error = ex.Message });
            }
        }
    }
}
