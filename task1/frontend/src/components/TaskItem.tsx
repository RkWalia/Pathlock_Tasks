import React from 'react';
import type { Task } from '../types/Task';
import './TaskItem.css';

interface TaskItemProps {
  task: Task;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, onToggle, onDelete }) => {
  return (
    <div className="task-item">
      <div className="task-content">
        <input
          type="checkbox"
          checked={task.isCompleted}
          onChange={() => onToggle(task.id)}
          className="task-checkbox"
        />
        <span className={task.isCompleted ? 'task-text completed' : 'task-text'}>
          {task.description}
        </span>
      </div>
      <button onClick={() => onDelete(task.id)} className="delete-btn">
        Delete
      </button>
    </div>
  );
};

export default TaskItem;