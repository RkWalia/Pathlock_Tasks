using Microsoft.AspNetCore.Mvc;

namespace Assignment_01.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TasksController : ControllerBase
    {
        private readonly TaskService _taskService;

        public TasksController(TaskService taskService)
        {
            _taskService = taskService;
        }

        // GET: api/tasks
        [HttpGet]
        public ActionResult<List<TaskItem>> GetAllTasks()
        {
            return Ok(_taskService.GetAllTasks());
        }

        // GET: api/tasks/{id}
        [HttpGet("{id}")]
        public ActionResult<TaskItem> GetTaskById(Guid id)
        {
            var task = _taskService.GetTaskById(id);
            if (task == null)
                return NotFound();

            return Ok(task);
        }

        // POST: api/tasks
        [HttpPost]
        public ActionResult<TaskItem> CreateTask([FromBody] TaskItem task)
        {
            if (string.IsNullOrWhiteSpace(task.Description))
                return BadRequest("Description is required");

            var createdTask = _taskService.AddTask(task);
            return CreatedAtAction(nameof(GetTaskById), new { id = createdTask.Id }, createdTask);
        }

        // PUT: api/tasks/{id}
        [HttpPut("{id}")]
        public ActionResult UpdateTask(Guid id, [FromBody] TaskItem task)
        {
            if (string.IsNullOrWhiteSpace(task.Description))
                return BadRequest("Description is required");

            var updated = _taskService.UpdateTask(id, task);
            if (!updated)
                return NotFound();

            return NoContent();
        }

        // DELETE: api/tasks/{id}
        [HttpDelete("{id}")]
        public ActionResult DeleteTask(Guid id)
        {
            var deleted = _taskService.DeleteTask(id);
            if (!deleted)
                return NotFound();

            return NoContent();
        }
    }
}