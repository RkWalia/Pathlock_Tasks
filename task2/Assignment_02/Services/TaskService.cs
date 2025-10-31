using Assignment_02.Data;
using Assignment_02.DTOs;
using Assignment_02.Models;
using Microsoft.EntityFrameworkCore;

namespace Assignment_02.Services
{
    public class TaskService : ITaskService
    {
        private readonly ApplicationDbContext _context;

        public TaskService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<TaskItemDto?> CreateTask(int projectId, CreateTaskDto dto, int userId)
        {
            var project = await _context.Projects
                .FirstOrDefaultAsync(p => p.Id == projectId && p.UserId == userId);

            if (project == null)
                return null;

            var task = new TaskItem
            {
                Title = dto.Title,
                DueDate = dto.DueDate,
                ProjectId = projectId,
                EstimatedHours = dto.EstimatedHours,
                Dependencies = dto.Dependencies != null && dto.Dependencies.Any() 
                    ? string.Join(",", dto.Dependencies) 
                    : null
            };

            _context.Tasks.Add(task);
            await _context.SaveChangesAsync();

            return MapToDto(task);
        }

        public async Task<TaskItemDto?> UpdateTask(int taskId, UpdateTaskDto dto, int userId)
        {
            var task = await _context.Tasks
                .Include(t => t.Project)
                .FirstOrDefaultAsync(t => t.Id == taskId && t.Project.UserId == userId);

            if (task == null)
                return null;

            if (dto.Title != null)
                task.Title = dto.Title;

            if (dto.DueDate.HasValue)
                task.DueDate = dto.DueDate;

            if (dto.IsCompleted.HasValue)
                task.IsCompleted = dto.IsCompleted.Value;

            if (dto.EstimatedHours.HasValue)
                task.EstimatedHours = dto.EstimatedHours;

            if (dto.Dependencies != null)
                task.Dependencies = dto.Dependencies.Any() 
                    ? string.Join(",", dto.Dependencies) 
                    : null;

            await _context.SaveChangesAsync();

            return MapToDto(task);
        }

        public async Task<bool> DeleteTask(int taskId, int userId)
        {
            var task = await _context.Tasks
                .Include(t => t.Project)
                .FirstOrDefaultAsync(t => t.Id == taskId && t.Project.UserId == userId);

            if (task == null)
                return false;

            _context.Tasks.Remove(task);
            await _context.SaveChangesAsync();
            return true;
        }

        private static TaskItemDto MapToDto(TaskItem task)
        {
            return new TaskItemDto
            {
                Id = task.Id,
                Title = task.Title,
                DueDate = task.DueDate,
                IsCompleted = task.IsCompleted,
                ProjectId = task.ProjectId,
                EstimatedHours = task.EstimatedHours,
                Dependencies = string.IsNullOrEmpty(task.Dependencies) 
                    ? new List<string>() 
                    : task.Dependencies.Split(',').ToList()
            };
        }
    }
}