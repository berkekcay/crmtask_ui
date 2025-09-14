using Microsoft.AspNetCore.Mvc;
using CRM.Business.Interfaces;
using CRM.Core.Models;

namespace CRM.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ActivitiesController : ControllerBase
    {
        private readonly IActivityService _activityService;

        public ActivitiesController(IActivityService activityService)
        {
            _activityService = activityService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Activity>>> GetAll()
        {
            var activities = await _activityService.GetAllActivitiesAsync();
            return Ok(activities);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Activity>> GetById(int id)
        {
            var activity = await _activityService.GetActivityByIdAsync(id);
            if (activity == null) return NotFound();
            return Ok(activity);
        }

        [HttpPost]
        public async Task<ActionResult<Activity>> Create(Activity activity)
        {
            var created = await _activityService.CreateActivityAsync(activity);
            return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, Activity activity)
        {
            if (id != activity.Id) return BadRequest();
            var updated = await _activityService.UpdateActivityAsync(activity);
            return Ok(updated);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var result = await _activityService.DeleteActivityAsync(id);
            if (!result) return NotFound();
            return NoContent();
        }
    }
}
