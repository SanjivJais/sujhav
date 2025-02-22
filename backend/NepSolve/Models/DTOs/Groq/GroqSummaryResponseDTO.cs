using System.Text.Json.Serialization;

namespace NepSolve.Models.DTOs.Groq
{
    public class GroqSummaryResponseDTO
    {
        [JsonPropertyName("topic")]
        public string Topic { get; set; }

        [JsonPropertyName("clusterSummary")]
        public string ClusterSummary { get; set; }
    }
}
