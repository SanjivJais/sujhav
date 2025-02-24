using System.Text.Json.Serialization;

namespace NepSolve.Models.DTOs.Groq
{
    public class GroqResponse
    {
        [JsonPropertyName("choices")]
        public List<Choice> Choices { get; set; }
    }

    public class Choice
    {
        [JsonPropertyName("message")]
        public GroqMessage Message { get; set; }  // Rename Message to GroqMessage
    }

    public class GroqMessage  // Renamed this class
    {
        [JsonPropertyName("role")]
        public string Role { get; set; }

        [JsonPropertyName("content")]
        public string Content { get; set; }
    }


}
