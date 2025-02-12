using System.Globalization;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;
using NepSolve.Data;
using NepSolve.Models.DTOs.Region;
using NepSolve.Models.Entities;

namespace NepSolve.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RegionsController : ControllerBase
    {
        private readonly IMongoCollection<Region> _regions;
        public RegionsController(MongoDbService dbService)
        {
            _regions = dbService.Database?.GetCollection<Region>("regions");
        }

        [HttpGet]
        public async Task<IActionResult> GetRegions()
        {
            try
            {
                var regions = await _regions.Find(r => true).ToListAsync();
                return Ok(regions);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Internal Server Error", error = ex.Message });
            }
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetRegion([FromRoute] string id)
        {
            try
            {
                var region = await _regions.Find(r => r.Id == id).FirstOrDefaultAsync();
                if (region == null)
                    return NotFound(new { message = "Region not found." });
                return Ok(region);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Internal Server Error", error = ex.Message });
            }
        }


        [HttpPost]
        [Authorize]
        public async Task<IActionResult> CreateRegion([FromBody] RegionCreateDTO regionRequest)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(regionRequest.RegionName) || regionRequest.RegionName.Length<3)
                    return BadRequest(new { message = "Region name must contain at least 3 letters" });
                if(string.IsNullOrWhiteSpace(regionRequest.CreatedBy))
                    return BadRequest(new { message = "Something went wrong, please try again!" });

                // check if region already exists
                var regionExists = await _regions.Find(r => r.RegionName.ToLower() == regionRequest.RegionName.ToLower()).FirstOrDefaultAsync();
                if (regionExists != null)
                    return BadRequest(new { message = "Region already exists." });
                var region = new Region
                {
                    CreatedBy = regionRequest.CreatedBy,
                    RegionName = CultureInfo.CurrentCulture.TextInfo.ToTitleCase(regionRequest.RegionName.ToLower())
                };


                await _regions.InsertOneAsync(region);
                return Ok(region);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Internal Server Error", error = ex.Message });
            }
        }

    }
}
