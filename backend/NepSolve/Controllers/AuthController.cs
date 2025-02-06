using Microsoft.AspNetCore.Mvc;
using MongoDB.Bson;
using MongoDB.Driver;
using NepSolve.Data;
using NepSolve.Models.Entities;
using NepSolve.Models.DTOs.Auth;
using NepSolve.Utilities;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

namespace NepSolve.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IMongoCollection<User> _users;
        private readonly JwtHandler _jwtHandler;

        public AuthController(MongoDbService dbService, JwtHandler jwtHandler)
        {
            _users = dbService.Database?.GetCollection<User>("users");
            _jwtHandler = jwtHandler;
        }


        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterRequestDTO request)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(request.Email) || string.IsNullOrWhiteSpace(request.Password) || string.IsNullOrWhiteSpace(request.Username))
                    return BadRequest(new {message = "Fields are required." });

                var existingUserByEmail = await _users.Find(u => u.Email == request.Email).FirstOrDefaultAsync();
                if (existingUserByEmail != null)
                    return Conflict(new { message = "User with this email already exists." });

                var existingUserByUsername = await _users.Find(u => u.Username == request.Username).FirstOrDefaultAsync();
                if (existingUserByUsername != null)
                    return Conflict(new { message = "User with this username already exists." });

                // Hash the password before saving (implement proper hashing)
                var hashedPass = BCrypt.Net.BCrypt.HashPassword(request.Password);

                var newUser = new User
                {
                    Email = request.Email,
                    Username = request.Username,
                    Password = hashedPass,
                };

                await _users.InsertOneAsync(newUser);

                return Ok();
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Internal Server Error", error = ex.Message });
            }
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequestDTO request)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(request.Email) || string.IsNullOrWhiteSpace(request.Password))
                    return BadRequest(new { message = "Email and password are required." });
                var user = await _users.Find(u => u.Email == request.Email).FirstOrDefaultAsync();
                if (user == null)
                    return NotFound(new { message = "Invalid credentials." });
                if (!BCrypt.Net.BCrypt.Verify(request.Password, user.Password))
                    return Unauthorized(new { message = "Invalid credentials." });
                // Generate JWT token
                var token = _jwtHandler.GenerateToken(user);

                return Ok(token);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Internal Server Error", error = ex.Message });
            }
        }


        [HttpGet("users/me")]
        [Authorize]
        public async Task<IActionResult> GetUserData()
        {
            try
            {
                // Get the user's ID from the token
                var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

                if (!ObjectId.TryParse(userId, out var parsedUserId))
                {
                    return Unauthorized(new { message = "Unauthorized user!" });
                }

                // Fetch user details from the database using the userId
                var user = await _users.Find(u => u.Id == userId).FirstOrDefaultAsync();
                if (user == null)
                {
                    return NotFound(new { message = "User not found!" });
                }

                var response = new AuthResponseDTO
                {
                    Id = user.Id,
                    Email = user.Email,
                    Username = user.Username,
                    DisplayName = user.DisplayName,
                    Role = user.Role,
                    CreatedAt = user.CreatedAt,
                };
                return Ok(response);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Internal Server Error", error = ex.Message });

            }
        }


        /// Get all users (for testing, should be restricted in production)
        [HttpGet("users")]
        public async Task<IActionResult> GetAllUsers()
        {
            try
            {
                var users = await _users.Find(_ => true).ToListAsync();
                return Ok(users);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Internal Server Error", error = ex.Message });
            }
        }
    }
}
