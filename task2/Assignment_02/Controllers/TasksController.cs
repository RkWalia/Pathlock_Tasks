using Assignment_02.DTOs;
using Assignment_02.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Assignment_02.Controllers
{
    [ApiController]
    [Route("api/projects/{projectId}/tasks")]
    [Authorize]
    public class TasksController : ControllerBase
    {
        private readonly ITaskService _taskService;

        public TasksController(ITaskService taskService)
        {
            _taskService = taskService;
        }

        private int GetUserId()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            return int.Parse(userIdClaim ?? "0");
        }

        [HttpPost]
        public async Task<IActionResult> Create(int projectId, [FromBody] CreateTaskDto dto)
        {
            var task = await _taskService.CreateTask(projectId, dto, GetUserId());
            if (task == null)
                return NotFound(new { message = "Project not found" });

            return CreatedAtAction(nameof(Create), new { projectId, id = task.Id }, task);
        }
    }

    [ApiController]
    [Route("api/tasks")]
    [Authorize]
    public class TasksManagementController : ControllerBase
    {
        private readonly ITaskService _taskService;

        public TasksManagementController(ITaskService taskService)
        {
            _taskService = taskService;
        }

        private int GetUserId()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            return int.Parse(userIdClaim ?? "0");
        }

        [HttpPut("{taskId}")]
        public async Task<IActionResult> Update(int taskId, [FromBody] UpdateTaskDto dto)
        {
            var task = await _taskService.UpdateTask(taskId, dto, GetUserId());
            if (task == null)
                return NotFound();

            return Ok(task);
        }

        [HttpDelete("{taskId}")]
        public async Task<IActionResult> Delete(int taskId)
        {
            var result = await _taskService.DeleteTask(taskId, GetUserId());
            if (!result)
                return NotFound();

            return NoContent();
        }
    }
}