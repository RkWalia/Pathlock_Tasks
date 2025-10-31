using System.ComponentModel.DataAnnotations;

namespace Assignment_02.DTOs
{
    public class ScheduleTaskDto
    {
        [Required]
        public string Title { get; set; } = string.Empty;

        [Required]
        [Range(1, 1000)]
        public int EstimatedHours { get; set; }

        public DateTime? DueDate { get; set; }

        public List<string> Dependencies { get; set; } = new();
    }

    public class ScheduleRequestDto
    {
        [Required]
        public List<ScheduleTaskDto> Tasks { get; set; } = new();
    }

    public class ScheduleResponseDto
    {
        public List<string> RecommendedOrder { get; set; } = new();
        public List<ScheduleWarning> Warnings { get; set; } = new();
    }

    public class ScheduleWarning
    {
        public string TaskTitle { get; set; } = string.Empty;
        public string Message { get; set; } = string.Empty;
    }
}