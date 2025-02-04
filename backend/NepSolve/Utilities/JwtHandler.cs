using Microsoft.IdentityModel.Tokens;
using NepSolve.Models.Entities;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;

namespace NepSolve.Utilities
{
    public class JwtHandler
    {
        private readonly IConfiguration _configuration;

        public JwtHandler(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public string GenerateToken(User user)
        {
            var claims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Name, user.Email),
                new Claim(ClaimTypes.Role, user.Role),
            };

            var hexKey = _configuration["Jwt:Key"];
            var keyBytes = HexToByte.HexStringToByteArray(hexKey);
            var key = new SymmetricSecurityKey(keyBytes);

            var cred = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: _configuration["Jwt:Issuer"],
                audience: _configuration["Jwt:Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddDays(3),
                signingCredentials: cred
            );

            return new JwtSecurityTokenHandler().WriteToken(token);

        }
    }
}
