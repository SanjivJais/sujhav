namespace NepSolve.Models.DTOs.Auth
{
    public class AuthResponse
    {
        public string Id { get; set; }
        public string DisplayName { get; set; }
        public string Username { get; set; }
        public string Email { get; set; }
        public string Role { get; set; }
        public string Token { get; set; }
        public string CreatedAt { get; set; }
    }
}
