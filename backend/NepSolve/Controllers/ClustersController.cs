using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Bson;
using MongoDB.Driver;
using NepSolve.Data;
using NepSolve.Models.DTOs.Cluster;
using NepSolve.Models.Entities;

namespace NepSolve.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ClustersController : ControllerBase
    {
        private readonly IMongoCollection<Cluster> _clusters;
        private readonly IMongoCollection<Post> _posts;
        
        public ClustersController(MongoDbService dbService, HttpClient httpClient, IConfiguration configuration)
        {
            _clusters = dbService.Database?.GetCollection<Cluster>("clusters");
            _posts = dbService.Database?.GetCollection<Post>("posts");
        }

        [HttpPost("find-clusters")]
        public async Task<IActionResult> FindSemanticClusters([FromBody] double[] embedding)
        {
            try
            {
                if (embedding == null || embedding.Length == 0)
                    return BadRequest(new { message = "Invalid embedding data." });

                double similarityThreshold = 0.8;

                var pipeline = new BsonDocument[]
                {
                    new BsonDocument
                    {
                        {
                            "$vectorSearch", new BsonDocument
                            {
                                { "index", "cluster_summary_embedding_index" },
                                { "path", "summaryEmbedding" },
                                { "queryVector", new BsonArray(embedding) },
                                { "numCandidates", 10 },
                                { "limit", 3 },
                                {"similarity", "cosine" },

                            }
                        }
                    },
                    new BsonDocument
                    {
                        { "$addFields", new BsonDocument
                            {
                                { "similarity", new BsonDocument("$meta", "vectorSearchScore") } // Ensure similarity score is set
                            }
                        }
                    },
                    // Project similarity score
                    new BsonDocument
                    {
                        { "$project", new BsonDocument
                            {
                                { "_id", 1 },
                                { "topic", 1 },
                                { "clusterSummary", 1 },
                                { "posts", 1 },
                                { "regions", 1 },
                                { "tags", 1 },
                                { "labels", 1 },
                                { "similarity", 1 }
                            }
                        }
                    }


                };

                var clusters = await _clusters.Aggregate<BsonDocument>(pipeline).ToListAsync();

                // Filter out results below the threshold
                var filteredClusters = clusters
                    .Where(c => c["similarity"].AsDouble >= similarityThreshold)
                    .Select(c => new SearchClusterResponseDTO
                    {
                        Id = c["_id"].ToString(),
                        Topic = c.GetValue("topic", "").ToString(),
                        ClusterSummary = c.GetValue("clusterSummary", "").ToString(),
                        Posts = c.GetValue("posts", new BsonArray()).AsBsonArray.Select(p => p.ToString()).ToList(),
                        Regions = c.GetValue("regions", new BsonArray()).AsBsonArray.Select(r => r.ToString()).ToList(),
                        Tags = c.GetValue("tags", new BsonArray()).AsBsonArray.Select(t => t.ToString()).ToList(),
                        Labels = c.GetValue("labels", new BsonArray()).AsBsonArray.Select(l => l.ToString()).ToList(),
                        Similarity = c["similarity"].AsDouble
                    }
                    )
                    .ToList();

                return Ok(filteredClusters);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Internal Server Error", error = ex.Message });
            }
        }


        // Create a new cluster
        [HttpPost("create")]
        [Authorize]
        public async Task<IActionResult> CreateCluster([FromBody] ClusterCreateDTO clusterRequest)
        {
            try
            {
                if (string.IsNullOrEmpty(clusterRequest.Topic) || clusterRequest.ClusterSummary == null)
                    return BadRequest(new { message = "Invalid cluster data." });

                if(clusterRequest.SummaryEmbedding == null || clusterRequest.SummaryEmbedding.Length == 0)
                    return BadRequest(new { message = "Invalid cluster summary embedding data." });


                if(clusterRequest.Posts == null || clusterRequest.Posts.Count == 0)
                    return BadRequest(new { message = "Invalid cluster posts data." });

                var cluster = new Cluster
                {
                    Topic = clusterRequest.Topic,
                    ClusterSummary = clusterRequest.ClusterSummary,
                    Posts = clusterRequest.Posts,
                    Regions = clusterRequest.Regions,
                    //Tags = clusterRequest.Tags,
                    //Labels = clusterRequest.Labels,
                    SummaryEmbedding = clusterRequest.SummaryEmbedding
                };

                await _clusters.InsertOneAsync(cluster);
                return CreatedAtAction(nameof(GetCluster), new { id = cluster.Id }, cluster);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Internal Server Error", error = ex.Message });
            }
        }



        // Get a specific cluster by ID
        [HttpGet("{id}")]
        public async Task<IActionResult> GetCluster([FromRoute] string id)
        {
            try
            {
                var cluster = await _clusters.Find(c => c.Id == id).FirstOrDefaultAsync();
                if (cluster == null)
                    return NotFound(new { message = "Cluster not found." });

                return Ok(cluster);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Internal Server Error", error = ex.Message });
            }
        }


        // fetch clusters
        [HttpGet]
        public async Task<IActionResult> FetchClusters()
        {
            try
            {
                var clusters = await _clusters.Find(_ => true).ToListAsync();
                return Ok(clusters);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Internal Server Error", error = ex.Message });
            }
        }

    }

}
