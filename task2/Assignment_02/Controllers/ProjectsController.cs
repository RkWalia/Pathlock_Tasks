using Assignment_02.DTOs;
using Assignment_02.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Assignment_02.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class ProjectsController : ControllerBase
    {
        private readonly IProjectService _projectService;
        private readonly ISchedulerService _schedulerService;

        public ProjectsController(IProjectService projectService, ISchedulerService schedulerService)
        {
            _projectService = projectService;
            _schedulerService = schedulerService;
        }

        private int GetUserId()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            return int.Parse(userIdClaim ?? "0");
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var projects = await _projectService.GetAllProjects(GetUserId());
            return Ok(projects);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var project = await _projectService.GetProjectById(id, GetUserId());
            if (project == null)
                return NotFound();

            return Ok(project);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateProjectDto dto)
        {
            var project = await _projectService.CreateProject(dto, GetUserId());
            return CreatedAtAction(nameof(GetById), new { id = project.Id }, project);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var result = await _projectService.DeleteProject(id, GetUserId());
            if (!result)
                return NotFound();

            return NoContent();
        }

        [HttpPost("{projectId}/schedule")]
        public IActionResult Schedule(int projectId, [FromBody] ScheduleRequestDto request)
        {
            var result = _schedulerService.ScheduleTasks(request);
            return Ok(result);
        }
    }
}