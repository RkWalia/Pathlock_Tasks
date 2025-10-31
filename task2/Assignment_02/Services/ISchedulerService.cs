using Assignment_02.DTOs;

namespace Assignment_02.Services
{
    public interface ISchedulerService
    {
        ScheduleResponseDto ScheduleTasks(ScheduleRequestDto request);
    }
}