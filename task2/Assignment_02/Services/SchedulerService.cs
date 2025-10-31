using Assignment_02.DTOs;

namespace Assignment_02.Services
{
    public class SchedulerService : ISchedulerService
    {
        public ScheduleResponseDto ScheduleTasks(ScheduleRequestDto request)
        {
            var response = new ScheduleResponseDto();
            var taskMap = request.Tasks.ToDictionary(t => t.Title, t => t);
            var scheduled = new HashSet<string>();
            var recommendedOrder = new List<string>();

            // Topological sort with dependency resolution
            while (scheduled.Count < request.Tasks.Count)
            {
                var readyTasks = request.Tasks
                    .Where(t => !scheduled.Contains(t.Title) &&
                                t.Dependencies.All(dep => scheduled.Contains(dep)))
                    .ToList();

                if (!readyTasks.Any())
                {
                    // Circular dependency detected
                    var remaining = request.Tasks
                        .Where(t => !scheduled.Contains(t.Title))
                        .Select(t => t.Title);
                    
                    response.Warnings.Add(new ScheduleWarning
                    {
                        TaskTitle = string.Join(", ", remaining),
                        Message = "Circular dependency detected. These tasks cannot be scheduled."
                    });
                    break;
                }

                // Sort by due date (earliest first), then by estimated hours (shortest first)
                var nextTask = readyTasks
                    .OrderBy(t => t.DueDate ?? DateTime.MaxValue)
                    .ThenBy(t => t.EstimatedHours)
                    .First();

                recommendedOrder.Add(nextTask.Title);
                scheduled.Add(nextTask.Title);

                // Check for potential deadline issues
                if (nextTask.DueDate.HasValue)
                {
                    var totalHoursBeforeThis = recommendedOrder
                        .Take(recommendedOrder.Count - 1)
                        .Sum(title => taskMap.ContainsKey(title) ? taskMap[title].EstimatedHours : 0);

                    var estimatedCompletion = DateTime.Now.AddHours(totalHoursBeforeThis + nextTask.EstimatedHours);
                    
                    if (estimatedCompletion > nextTask.DueDate.Value)
                    {
                        response.Warnings.Add(new ScheduleWarning
                        {
                            TaskTitle = nextTask.Title,
                            Message = $"May miss deadline. Estimated completion: {estimatedCompletion:yyyy-MM-dd}, Due: {nextTask.DueDate.Value:yyyy-MM-dd}"
                        });
                    }
                }
            }

            response.RecommendedOrder = recommendedOrder;
            return response;
        }
    }
}