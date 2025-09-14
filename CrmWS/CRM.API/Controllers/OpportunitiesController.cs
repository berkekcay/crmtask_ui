using Microsoft.AspNetCore.Mvc;
using CRM.Business.Interfaces;
using CRM.Core.Models;

namespace CRM.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class OpportunitiesController : ControllerBase
    {
        private readonly IOpportunityService _opportunityService;

        public OpportunitiesController(IOpportunityService opportunityService)
        {
            _opportunityService = opportunityService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Opportunity>>> GetAll()
        {
            var opportunities = await _opportunityService.GetAllOpportunitiesAsync();
            return Ok(opportunities);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Opportunity>> GetById(int id)
        {
            var opportunity = await _opportunityService.GetOpportunityByIdAsync(id);
            if (opportunity == null) return NotFound();
            return Ok(opportunity);
        }

        [HttpGet("user/{userId}")]
        public async Task<ActionResult<IEnumerable<Opportunity>>> GetByUser(int userId)
        {
            var opportunities = await _opportunityService.GetOpportunitiesByUserAsync(userId);
            return Ok(opportunities);
        }

        [HttpPost]
        public async Task<ActionResult<Opportunity>> Create(Opportunity opportunity)
        {
            var created = await _opportunityService.CreateOpportunityAsync(opportunity);
            return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, Opportunity opportunity)
        {
            if (id != opportunity.Id) return BadRequest();
            var updated = await _opportunityService.UpdateOpportunityAsync(opportunity);
            return Ok(updated);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var result = await _opportunityService.DeleteOpportunityAsync(id);
            if (!result) return NotFound();
            return NoContent();
        }
    }
}
