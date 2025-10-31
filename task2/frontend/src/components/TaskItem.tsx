import React, { useState } from 'react';
import { Task, UpdateTaskData } from '../types';
import '../styles/TaskItem.css';

interface TaskItemProps {
  task: Task;
  onUpdate: (taskId: number, data: UpdateTaskData) => void;
  onDelete: (taskId: number) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);

  const handleToggleComplete = () => {
    onUpdate(task.id, { isCompleted: !task.isCompleted });
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      onDelete(task.id);
    }
  };

  const handleSaveEdit = () => {
    if (editTitle.trim()) {
      onUpdate(task.id, { title: editTitle });
      setIsEditing(false);
    }
  };

  const handleCancelEdit = () => {
    setEditTitle(task.title);
    setIsEditing(false);
  };

  return (
    <div className={`task-item ${task.isCompleted ? 'completed' : ''}`}>
      <input
        type="checkbox"
        checked={task.isCompleted}
        onChange={handleToggleComplete}
        className="task-checkbox"
      />
      {isEditing ? (
        <div className="task-edit">
          <input
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            className="task-edit-input"
            autoFocus
          />
          <button onClick={handleSaveEdit} className="save-button">
            ✓
          </button>
          <button onClick={handleCancelEdit} className="cancel-button">
            ✕
          </button>
        </div>
      ) : (
        <>
          <div className="task-content">
            <span className="task-title">{task.title}</span>
            {task.dueDate && (
              <span className="task-due-date">Due: {new Date(task.dueDate).toLocaleDateString()}</span>
            )}
            {task.estimatedHours && (
              <span className="task-hours">Est: {task.estimatedHours}h</span>
            )}
            {task.dependencies.length > 0 && (
              <span className="task-dependencies">Depends on: {task.dependencies.join(', ')}</span>
            )}
          </div>
          <div className="task-actions">
            <button onClick={() => setIsEditing(true)} className="edit-button" title="Edit task">
              ✏️
            </button>
            <button onClick={handleDelete} className="delete-button" title="Delete task">
              🗑️
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default TaskItem;