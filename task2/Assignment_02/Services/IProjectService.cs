using Assignment_02.DTOs;

namespace Assignment_02.Services
{
    public interface IProjectService
    {
        Task<List<ProjectDto>> GetAllProjects(int userId);
        Task<ProjectDto?> GetProjectById(int projectId, int userId);
        Task<ProjectDto> CreateProject(CreateProjectDto dto, int userId);
        Task<bool> DeleteProject(int projectId, int userId);
    }
}