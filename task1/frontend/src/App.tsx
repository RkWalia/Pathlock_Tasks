import { useState, useEffect } from 'react';
import type { Task, FilterType } from './types/Task';
import { taskService } from './services/taskService';
import AddTask from './components/AddTask';
import TaskList from './components/TaskList';
import FilterButtons from './components/FilterButtons';
import './App.css';

const STORAGE_KEY = 'tasks';

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState<FilterType>('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load tasks from localStorage on mount
  useEffect(() => {
    const storedTasks = localStorage.getItem(STORAGE_KEY);
    if (storedTasks) {
      setTasks(JSON.parse(storedTasks));
      setLoading(false);
    } else {
      fetchTasks();
    }
  }, []);

  // Save tasks to localStorage whenever they change
  useEffect(() => {
    if (tasks.length > 0 || !loading) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    }
  }, [tasks, loading]);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const fetchedTasks = await taskService.getAllTasks();
      setTasks(fetchedTasks);
      setError(null);
    } catch (err) {
      setError('Failed to fetch tasks. Using local storage data.');
      console.error('Error fetching tasks:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTask = async (description: string) => {
    try {
      const newTask = await taskService.createTask(description);
      setTasks([...tasks, newTask]);
      setError(null);
    } catch (err) {
      // Fallback to local-only task
      const localTask: Task = {
        id: crypto.randomUUID(),
        description,
        isCompleted: false,
      };
      setTasks([...tasks, localTask]);
      setError('Added task locally. Server might be offline.');
      console.error('Error adding task:', err);
    }
  };

  const handleToggleTask = async (id: string) => {
    const task = tasks.find((t) => t.id === id);
    if (!task) return;

    const updatedTask = { ...task, isCompleted: !task.isCompleted };

    try {
      await taskService.updateTask(id, updatedTask);
      setTasks(tasks.map((t) => (t.id === id ? updatedTask : t)));
      setError(null);
    } catch (err) {
      // Update locally even if server fails
      setTasks(tasks.map((t) => (t.id === id ? updatedTask : t)));
      setError('Updated task locally. Server might be offline.');
      console.error('Error updating task:', err);
    }
  };

  const handleDeleteTask = async (id: string) => {
    try {
      await taskService.deleteTask(id);
      setTasks(tasks.filter((t) => t.id !== id));
      setError(null);
    } catch (err) {
      // Delete locally even if server fails
      setTasks(tasks.filter((t) => t.id !== id));
      setError('Deleted task locally. Server might be offline.');
      console.error('Error deleting task:', err);
    }
  };

  const getFilteredTasks = () => {
    switch (filter) {
      case 'active':
        return tasks.filter((task) => !task.isCompleted);
      case 'completed':
        return tasks.filter((task) => task.isCompleted);
      default:
        return tasks;
    }
  };

  const taskCounts = {
    all: tasks.length,
    active: tasks.filter((t) => !t.isCompleted).length,
    completed: tasks.filter((t) => t.isCompleted).length,
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-text">Loading...</div>
      </div>
    );
  }

  return (
    <div className="app-container">
      <div className="app-content">
        <header className="app-header">
          <h1 className="app-title">Task Manager</h1>
          <p className="app-subtitle">Organize your tasks efficiently</p>
        </header>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <div className="add-task-container">
          <AddTask onAdd={handleAddTask} />
        </div>

        <FilterButtons
          currentFilter={filter}
          onFilterChange={setFilter}
          taskCounts={taskCounts}
        />

        <div className="task-list-container">
          <TaskList
            tasks={getFilteredTasks()}
            onToggle={handleToggleTask}
            onDelete={handleDeleteTask}
          />
        </div>

        <footer className="app-footer">
          <p>Total: {taskCounts.all} | Active: {taskCounts.active} | Completed: {taskCounts.completed}</p>
        </footer>
      </div>
    </div>
  );
}

export default App;