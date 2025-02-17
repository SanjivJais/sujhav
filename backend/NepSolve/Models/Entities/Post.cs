using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Bson;
using System.ComponentModel.DataAnnotations;

namespace NepSolve.Models.Entities
{
    public class Post
    {
        [BsonId]
        [BsonElement("_id"), BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; } = ObjectId.GenerateNewId().ToString();

        [BsonElement("user"), Required]
        public PostUser User { get; set; }  // Store user ID & username

        [BsonElement("content"), Required]
        public string Content { get; set; }

        [BsonElement("regions")]
        public List<string> Regions { get; set; } = new List<string>();  // Store region ID & name

        [BsonElement("upvote")]
        public int Upvote { get; set; } = 0;

        [BsonElement("downvote")]
        public int Downvote { get; set; } = 0;

        [BsonElement("embedding")]
        public List<double> Embedding { get; set; } = new List<double>();  // An AI-generated text embedding vector

        [BsonElement("createdAt")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        [BsonElement("updatedAt")]
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    }

    // Embedded user details
    public class PostUser
    {
        [BsonElement("id"), BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; }

        [BsonElement("username")]
        public string Username { get; set; }
    }
}
