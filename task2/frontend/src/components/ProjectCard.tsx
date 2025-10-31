import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Project } from '../types';
import '../styles/ProjectCard.css';

interface ProjectCardProps {
  project: Project;
  onDelete: (id: number) => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, onDelete }) => {
  const navigate = useNavigate();

  const completedTasks = project.tasks.filter((t) => t.isCompleted).length;
  const totalTasks = project.tasks.length;

  const handleClick = () => {
    navigate(`/projects/${project.id}`);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this project?')) {
      onDelete(project.id);
    }
  };

  return (
    <div className="project-card" onClick={handleClick}>
      <div className="project-card-header">
        <h3>{project.title}</h3>
        <button onClick={handleDelete} className="delete-button" title="Delete project">
          🗑️
        </button>
      </div>
      {project.description && <p className="project-description">{project.description}</p>}
      <div className="project-card-footer">
        <span className="task-count">
          Tasks: {completedTasks}/{totalTasks}
        </span>
        <span className="project-date">{new Date(project.createdAt).toLocaleDateString()}</span>
      </div>
      {totalTasks > 0 && (
        <div className="progress-bar">
          <div
            className="progress-bar-fill"
            style={{ width: `${(completedTasks / totalTasks) * 100}%` }}
          ></div>
        </div>
      )}
    </div>
  );
};

export default ProjectCard;