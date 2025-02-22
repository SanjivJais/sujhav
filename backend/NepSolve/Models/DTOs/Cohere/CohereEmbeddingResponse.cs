using System.Text.Json.Serialization;

namespace NepSolve.Models.DTOs.Cohere
{
    public class CohereEmbeddingResponse
    {
        [JsonPropertyName("id")]
        public string Id { get; set; }

        [JsonPropertyName("embeddings")]
        public EmbeddingData Embeddings { get; set; }
    }

    public class EmbeddingData
    {
        [JsonPropertyName("float")]
        public double[][] Float { get; set; }
    }

    public class EmbeddingApiResponse
    {
        public double[] Embeddings { get; set; }
    }


}
