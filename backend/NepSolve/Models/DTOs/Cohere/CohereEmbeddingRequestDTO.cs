using System.Text.Json.Serialization;

namespace NepSolve.Models.DTOs.Cohere
{
    public class CohereEmbeddingRequestDTO
    {
        [JsonPropertyName("model")]
        public string Model { get; set; } = "embed-english-v3.0";

        [JsonPropertyName("texts")]
        public List<string> Texts { get; set; } = new();

        [JsonPropertyName("input_type")]
        public string InputType { get; set; } = "classification";

        [JsonPropertyName("embedding_types")]
        public List<string> EmbeddingTypes { get; set; } = new() { "float" };
    }
}
