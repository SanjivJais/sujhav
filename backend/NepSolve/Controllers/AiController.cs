using System.Text.Json;
using System.Text;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using NepSolve.Models.DTOs.Groq;
using NepSolve.Models.DTOs.Cohere;
using Microsoft.AspNetCore.Authorization;

namespace NepSolve.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AiController : ControllerBase
    {
        private readonly HttpClient _httpClient;
        private readonly string _groqApiKey;
        private readonly string _cohereApiKey;
        public AiController(HttpClient httpClient, IConfiguration configuration)
        {
            _httpClient = httpClient;
            _groqApiKey = configuration["GROQ_API_KEY"];
            _cohereApiKey = configuration["COHERE_API_KEY"];
        }


        [HttpPost("summarize")]
        [Authorize]
        public async Task<IActionResult> SummarizeText([FromBody] string inputText)
        {
            if (string.IsNullOrWhiteSpace(inputText))
                return BadRequest("Input text cannot be empty");

            

            var requestBody = new GroqRequestDTO
            {
                Messages = new()
                {
                    new Message
                    {
                        Role = "system",
                        Content = "You are an expert at summarizing textual content and also generating a concise and short topic for the content. You'll get a text content and generate a topic and a short summary of maximum 150 words and return only a JSON response in the following format:\n\n{\n\"topic\": \"<generated_topic>\",\n\"clusterSummary\": \"<generated_summary>\"\n}"
                    },
                    new Message 
                    { 
                        Role = "user", 
                        Content = inputText 
                    }
                }
            };

            var jsonContent = new StringContent(JsonSerializer.Serialize(requestBody), Encoding.UTF8, "application/json");

            _httpClient.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", _groqApiKey);

            var response = await _httpClient.PostAsync("https://api.groq.com/openai/v1/chat/completions", jsonContent);

            if (!response.IsSuccessStatusCode)
                return StatusCode((int)response.StatusCode, "Failed to fetch summary");

            var responseData = await response.Content.ReadAsStringAsync();
            //Console.WriteLine("Groq Raw Response: " + responseData);

            var groqApiResponse = JsonSerializer.Deserialize<GroqResponse>(responseData);

            if (groqApiResponse == null || groqApiResponse.Choices == null || groqApiResponse.Choices.Count == 0)
                return StatusCode(500, "Invalid response from Groq API");

            var rawContent = groqApiResponse.Choices[0].Message.Content;
            //Console.WriteLine("Extracted Content: " + rawContent);

            var summaryResponse = JsonSerializer.Deserialize<GroqSummaryResponseDTO>(rawContent);

            return Ok(summaryResponse);
        }



        [HttpPost("embedding")]
        [Authorize]
        public async Task<IActionResult> GetEmbedding([FromBody] List<string> texts)
        {
            if (texts == null || texts.Count == 0)
                return BadRequest("Texts cannot be empty");

            var requestBody = new CohereEmbeddingRequestDTO { Texts = texts };

            var jsonContent = new StringContent(JsonSerializer.Serialize(requestBody), Encoding.UTF8, "application/json");

            _httpClient.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", _cohereApiKey);

            var response = await _httpClient.PostAsync("https://api.cohere.com/v2/embed", jsonContent);

            if (!response.IsSuccessStatusCode)
                return StatusCode((int)response.StatusCode, "Failed to fetch embeddings");

            var responseData = await response.Content.ReadAsStringAsync();
            var embeddingResponse = JsonSerializer.Deserialize<CohereEmbeddingResponse>(responseData);

            // Extract and return only the float embeddings
            return Ok(new { embeddings = embeddingResponse.Embeddings.Float[0] });
        }
    }
}
