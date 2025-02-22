using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Bson;

namespace NepSolve.Models.Entities
{
    public class Cluster
    {
        [BsonId]
        [BsonElement("_id"), BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; } = ObjectId.GenerateNewId().ToString();

        [BsonElement("topic")]
        public string Topic { get; set; }

        [BsonElement("clusterSummary")]
        public string ClusterSummary { get; set; }

        [BsonElement("posts")]
        [BsonRepresentation(BsonType.ObjectId)]
        public List<string> Posts { get; set; } = new List<string>(); // List of post IDs

        [BsonElement("regions")]
        public List<string> Regions { get; set; } = new List<string>(); // List of region names

        [BsonElement("tags")]
        public List<string> Tags { get; set; } = new List<string>(); // List of tags

        [BsonElement("labels")]
        public List<string> Labels { get; set; } = new List<string>(); // Labels (BO, GS)

        [BsonElement("summaryEmbedding")]
        public double[] SummaryEmbedding { get; set; } = Array.Empty<double>(); // List of embedding numbers

        [BsonElement("createdAt")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        [BsonElement("updatedAt")]
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    }
}
