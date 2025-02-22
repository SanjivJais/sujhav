using System.Text.Json.Serialization;

namespace NepSolve.Models.DTOs.Groq
{
    public class GroqRequestDTO
    {
        [JsonPropertyName("messages")]
        public List<Message> Messages { get; set; } = new();

        [JsonPropertyName("model")]
        public string Model { get; set; } = "llama-3.3-70b-versatile";

        [JsonPropertyName("temperature")]
        public double Temperature { get; set; } = 1.0;

        [JsonPropertyName("max_completion_tokens")]
        public int MaxTokens { get; set; } = 1024;

        [JsonPropertyName("top_p")]
        public double TopP { get; set; } = 1.0;

        [JsonPropertyName("stream")]
        public bool Stream { get; set; } = false;

        [JsonPropertyName("response_format")]
        public object ResponseFormat { get; set; } = new { type = "json_object" };

        [JsonPropertyName("stop")]
        public object Stop { get; set; } = null;
    }

    public class Message
    {
        [JsonPropertyName("role")]
        public string Role { get; set; }

        [JsonPropertyName("content")]
        public string Content { get; set; }
    }
}
