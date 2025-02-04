using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;
using NepSolve.Data;
using NepSolve.Models.Entities;

namespace NepSolve.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IMongoCollection<User> _users;

        public AuthController(MongoDbService dbService)
        {
            _users = dbService.Database?.GetCollection<User>("users");
        }


        [HttpGet]
        public async Task<IEnumerable<User>> GetUsers()
        {
            return await _users.Find(FilterDefinition<User>.Empty).ToListAsync();
        }


        [HttpGet("{id}")]
        public async Task<ActionResult<User>> GetUserById([FromRoute] string id)
        {
            var filter = Builders<User>.Filter.Eq(x=> x.Id, id);
            var user = await _users.Find(filter).FirstOrDefaultAsync();
            return user == null ? NotFound() : Ok(user);
        }


        [HttpPost]
        public async Task<ActionResult> CreateUser([FromBody] User user)
        {
            await _users.InsertOneAsync(user);
            return CreatedAtAction(nameof(GetUserById), new { id = user.Id }, user);
        }


        [HttpPut("{id}")]
        public async Task<ActionResult> UpdateUser([FromRoute] string id, [FromBody] User user)
        {
            var filter = Builders<User>.Filter.Eq(x => x.Id, id);
            var update = Builders<User>.Update
                .Set(x => x.Username, user.Username)
                .Set(x => x.Email, user.Email)
                .Set(x => x.Name, user.Name)
                .Set(x => x.Password, user.Password);
            var result = await _users.UpdateOneAsync(filter, update);
            return result.ModifiedCount == 0 ? NotFound() : Ok();
        }


        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteUser([FromRoute] string id)
        {
            var filter = Builders<User>.Filter.Eq(x => x.Id, id);
            var result = await _users.DeleteOneAsync(filter);
            return result.DeletedCount == 0 ? NotFound() : Ok();
        }
    }
}
