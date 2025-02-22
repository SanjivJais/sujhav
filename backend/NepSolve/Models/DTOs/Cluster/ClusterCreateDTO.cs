namespace NepSolve.Models.DTOs.Cluster
{
    public class ClusterCreateDTO
    {
        public string Topic { get; set; }
        public string ClusterSummary { get; set; }
        public List<string> Posts { get; set; } = new List<string>();
        public List<string> Regions { get; set; } = new List<string>();
        //public List<string> Tags { get; set; } = new List<string>();
        //public List<string> Labels { get; set; } = new List<string>();
        public double[] SummaryEmbedding { get; set; } = Array.Empty<double>();
    }
}
