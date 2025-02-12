using NepSolve.Models.Entities;

namespace NepSolve.Models.DTOs.Post
{
    public class PostResponseDTO
    {
        public string Id { get; set; }
        public PostUser User { get; set; }
        public string Content { get; set; }
        public List<PostRegion> Regions { get; set; }
        public int Upvote { get; set; }
        public int Downvote { get; set; }
        public List<double> Embedding { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }
}
