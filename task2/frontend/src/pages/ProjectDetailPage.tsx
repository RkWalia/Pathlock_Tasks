import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { projectAPI, taskAPI } from "../services/api";
import {
  Project,
  CreateTaskData,
  UpdateTaskData,
  ScheduleRequest,
  ScheduleTaskData,
} from "../types";
import TaskItem from "../components/TaskItem";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorMessage from "../components/ErrorMessage";
import "../styles/ProjectDetail.css";

const ProjectDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [scheduledOrder, setScheduledOrder] = useState<string[]>([]);
  const [scheduleWarnings, setScheduleWarnings] = useState<
    Array<{ taskTitle: string; message: string }>
  >([]);
  const [newTask, setNewTask] = useState<CreateTaskData>({
    title: "",
    dueDate: undefined,
    estimatedHours: undefined,
    dependencies: [],
  });

  useEffect(() => {
    fetchProject();
  }, [id]);

  const fetchProject = async () => {
    try {
      setLoading(true);
      const data = await projectAPI.getById(Number(id));
      setProject(data);
    } catch (err) {
      setError("Failed to load project");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.title.trim()) {
      setError("Task title is required");
      return;
    }

    try {
      await taskAPI.create(Number(id), newTask);
      await fetchProject();
      setShowTaskModal(false);
      setNewTask({
        title: "",
        dueDate: undefined,
        estimatedHours: undefined,
        dependencies: [],
      });
    } catch (err) {
      setError("Failed to create task");
    }
  };

  const handleUpdateTask = async (taskId: number, data: UpdateTaskData) => {
    try {
      await taskAPI.update(taskId, data);
      await fetchProject();
    } catch (err) {
      setError("Failed to update task");
    }
  };

  const handleDeleteTask = async (taskId: number) => {
    try {
      await taskAPI.delete(taskId);
      await fetchProject();
    } catch (err) {
      setError("Failed to delete task");
    }
  };

  const handleSmartSchedule = async () => {
    if (!project || project.tasks.length === 0) {
      setError("No tasks to schedule");
      return;
    }

    const scheduleTasks: ScheduleTaskData[] = project.tasks.map((task) => ({
      title: task.title,
      estimatedHours: task.estimatedHours || 1,
      dueDate: task.dueDate,
      dependencies: task.dependencies || [],
    }));

    const request: ScheduleRequest = { tasks: scheduleTasks };

    try {
      const response = await projectAPI.schedule(Number(id), request);
      setScheduledOrder(response.recommendedOrder);
      setScheduleWarnings(response.warnings);
      setShowScheduleModal(true);
    } catch (err) {
      setError("Failed to generate schedule");
    }
  };

  if (loading) return <LoadingSpinner />;
  if (!project) return <ErrorMessage message="Project not found" />;

  const completedTasks = project.tasks.filter((t) => t.isCompleted).length;

  return (
    <div className="project-detail-container">
      <div className="project-detail-header">
        <button onClick={() => navigate("/dashboard")} className="back-button">
          ← Back
        </button>
        <div className="project-info">
          <h1>{project.title}</h1>
          {project.description && (
            <p className="project-description">{project.description}</p>
          )}
          <div className="project-stats">
            <span>
              Tasks: {completedTasks}/{project.tasks.length}
            </span>
            <span>
              Created: {new Date(project.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>
        <div className="header-actions">
          <button
            onClick={() => setShowTaskModal(true)}
            className="add-task-button"
          >
            + Add Task
          </button>
          {project.tasks.length > 0 && (
            <button onClick={handleSmartSchedule} className="schedule-button">
              🧠 Smart Schedule
            </button>
          )}
        </div>
      </div>
      {error && <ErrorMessage message={error} onClose={() => setError("")} />}
      <div className="tasks-section">
        {project.tasks.length === 0 ? (
          <div className="empty-state">
            <p>No tasks yet. Add your first task to get started!</p>
          </div>
        ) : (
          <div className="tasks-list">
            {project.tasks.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                onUpdate={handleUpdateTask}
                onDelete={handleDeleteTask}
              />
            ))}
          </div>
        )}
      </div>
      {showTaskModal && (
        <div className="modal-overlay" onClick={() => setShowTaskModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Add New Task</h2>
            <form onSubmit={handleCreateTask}>
              <div className="form-group">
                <label htmlFor="taskTitle">Title *</label>
                <input
                  type="text"
                  id="taskTitle"
                  value={newTask.title}
                  onChange={(e) =>
                    setNewTask({ ...newTask, title: e.target.value })
                  }
                  required
                  placeholder="Enter task title"
                />
              </div>
              <div className="form-group">
                <label htmlFor="dueDate">Due Date</label>
                <input
                  type="date"
                  id="dueDate"
                  value={newTask.dueDate || ""}
                  onChange={(e) =>
                    setNewTask({
                      ...newTask,
                      dueDate: e.target.value || undefined,
                    })
                  }
                />
              </div>
              <div className="form-group">
                <label htmlFor="estimatedHours">Estimated Hours</label>
                <input
                  type="number"
                  id="estimatedHours"
                  min="1"
                  value={newTask.estimatedHours || ""}
                  onChange={(e) =>
                    setNewTask({
                      ...newTask,
                      estimatedHours: e.target.value
                        ? Number(e.target.value)
                        : undefined,
                    })
                  }
                  placeholder="e.g., 8"
                />
              </div>
              <div className="form-group">
                <label htmlFor="dependencies">
                  Dependencies (comma-separated)
                </label>
                <input
                  type="text"
                  id="dependencies"
                  value={newTask.dependencies?.join(", ") || ""}
                  onChange={(e) =>
                    setNewTask({
                      ...newTask,
                      dependencies: e.target.value
                        .split(",")
                        .map((d) => d.trim())
                        .filter((d) => d),
                    })
                  }
                  placeholder="e.g., Design API, Setup Database"
                />
              </div>
              <div className="modal-actions">
                <button
                  type="button"
                  onClick={() => setShowTaskModal(false)}
                  className="cancel-button"
                >
                  Cancel
                </button>
                <button type="submit" className="submit-button">
                  Add Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}{" "}
      {showScheduleModal && (
        <div
          className="modal-overlay"
          onClick={() => setShowScheduleModal(false)}
        >
          <div
            className="modal-content schedule-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <h2>📋 Smart Schedule Recommendation</h2>
            <div className="schedule-content">
              <h3>Recommended Order:</h3>
              <ol className="schedule-list">
                {scheduledOrder.map((taskTitle, index) => (
                  <li key={index}>{taskTitle}</li>
                ))}
              </ol>

              {scheduleWarnings.length > 0 && (
                <>
                  <h3>⚠️ Warnings:</h3>
                  <ul className="warnings-list">
                    {scheduleWarnings.map((warning, index) => (
                      <li key={index}>
                        <strong>{warning.taskTitle}:</strong> {warning.message}
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>
            <div className="modal-actions">
              <button
                onClick={() => setShowScheduleModal(false)}
                className="submit-button"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default ProjectDetailPage;
