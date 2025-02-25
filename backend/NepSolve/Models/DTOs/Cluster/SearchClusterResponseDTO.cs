using System.Text.Json.Serialization;

namespace NepSolve.Models.DTOs.Cluster
{
    public class SearchClusterResponseDTO
    {
        [JsonPropertyName("_id")]
        public string Id { get; set; }

        [JsonPropertyName("topic")]
        public string Topic { get; set; }

        [JsonPropertyName("clusterSummary")]
        public string ClusterSummary { get; set; }

        [JsonPropertyName("posts")]
        public List<string> Posts { get; set; } = new List<string>();

        [JsonPropertyName("regions")]
        public List<string> Regions { get; set; } = new List<string>();

        [JsonPropertyName("tags")]
        public List<string> Tags { get; set; } = new List<string>();

        [JsonPropertyName("labels")]
        public List<string> Labels { get; set; } = new List<string>();

        [JsonPropertyName("similarity")]
        public double Similarity { get; set; }
    }
}
