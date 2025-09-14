using Microsoft.AspNetCore.Mvc;
using CRM.Business.Interfaces;
using CRM.Core.Models;

namespace CRM.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TasksController : ControllerBase
    {
        private readonly ICrmTaskService _taskService;

        public TasksController(ICrmTaskService taskService)
        {
            _taskService = taskService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<CrmTask>>> GetAll()
        {
            var tasks = await _taskService.GetAllTasksAsync();
            return Ok(tasks);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<CrmTask>> GetById(int id)
        {
            var task = await _taskService.GetTaskByIdAsync(id);
            if (task == null) return NotFound();
            return Ok(task);
        }

        [HttpPost]
        public async Task<ActionResult<CrmTask>> Create(CrmTask task)
        {
            var created = await _taskService.CreateTaskAsync(task);
            return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, CrmTask task)
        {
            if (id != task.Id) return BadRequest();
            var updated = await _taskService.UpdateTaskAsync(task);
            return Ok(updated);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var result = await _taskService.DeleteTaskAsync(id);
            if (!result) return NotFound();
            return NoContent();
        }

        [HttpPost("{id}/complete")]
        public async Task<IActionResult> Complete(int id)
        {
            var result = await _taskService.CompleteTaskAsync(id);
            if (!result) return NotFound();
            return NoContent();
        }
    }
}
