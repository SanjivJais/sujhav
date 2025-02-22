using NepSolve.Models.Entities;

namespace NepSolve.Models.DTOs.Post
{
    public class PostCreateDTO
    {
        public PostUser User { get; set; }  // Store user ID & username
        public string Content { get; set; }
        public List<string> Regions { get; set; }  // Store regionName
        public double[] Embedding { get; set; }  // An AI-generated text embedding vector
    }
}
