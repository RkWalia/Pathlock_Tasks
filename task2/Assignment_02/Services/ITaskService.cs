using Assignment_02.DTOs;

namespace Assignment_02.Services
{
    public interface ITaskService
    {
        Task<TaskItemDto?> CreateTask(int projectId, CreateTaskDto dto, int userId);
        Task<TaskItemDto?> UpdateTask(int taskId, UpdateTaskDto dto, int userId);
        Task<bool> DeleteTask(int taskId, int userId);
    }
}