namespace NepSolve.Models.DTOs.Cluster
{
    public class ClusterUpdateDTO
    {
        public string ClusterSummary { get; set; }
        public List<string> Posts { get; set; }
        public List<string> Regions { get; set; } = new List<string>();
        public List<string> Tags { get; set; } = new List<string>();
        public List<string> Labels { get; set; } = new List<string>();
        public double[] SummaryEmbedding { get; set; }
        public DateTime UpdatedAt { get; set; }
    }
}
