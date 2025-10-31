using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Add CORS policy
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp",
        policy =>
        {
            policy.WithOrigins("http://localhost:3000", "http://localhost:5173")
                  .AllowAnyHeader()
                  .AllowAnyMethod();
        });
});

// Register TaskService as Singleton for in-memory storage
builder.Services.AddSingleton<TaskService>();

var app = builder.Build();

// Configure the HTTP request pipeline
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseCors("AllowReactApp");

app.UseAuthorization();

app.MapControllers();

app.Run();

// Task Service for in-memory storage
public class TaskService
{
    private readonly List<TaskItem> _tasks = new();

    public List<TaskItem> GetAllTasks() => _tasks;

    public TaskItem? GetTaskById(Guid id) => _tasks.FirstOrDefault(t => t.Id == id);

    public TaskItem AddTask(TaskItem task)
    {
        task.Id = Guid.NewGuid();
        _tasks.Add(task);
        return task;
    }

    public bool UpdateTask(Guid id, TaskItem updatedTask)
    {
        var task = GetTaskById(id);
        if (task == null) return false;

        task.Description = updatedTask.Description;
        task.IsCompleted = updatedTask.IsCompleted;
        return true;
    }

    public bool DeleteTask(Guid id)
    {
        var task = GetTaskById(id);
        if (task == null) return false;

        _tasks.Remove(task);
        return true;
    }
}

// Task Model
public class TaskItem
{
    public Guid Id { get; set; }
    public string Description { get; set; } = string.Empty;
    public bool IsCompleted { get; set; }
}