export interface User {
  email: string;
  token: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
}

export interface Project {
  id: number;
  title: string;
  description?: string;
  createdAt: string;
  tasks: Task[];
}

export interface CreateProjectData {
  title: string;
  description?: string;
}

export interface Task {
  id: number;
  title: string;
  dueDate?: string;
  isCompleted: boolean;
  projectId: number;
  estimatedHours?: number;
  dependencies: string[];
}

export interface CreateTaskData {
  title: string;
  dueDate?: string;
  estimatedHours?: number;
  dependencies?: string[];
}

export interface UpdateTaskData {
  title?: string;
  dueDate?: string;
  isCompleted?: boolean;
  estimatedHours?: number;
  dependencies?: string[];
}

export interface ScheduleTaskData {
  title: string;
  estimatedHours: number;
  dueDate?: string;
  dependencies: string[];
}

export interface ScheduleRequest {
  tasks: ScheduleTaskData[];
}

export interface ScheduleWarning {
  taskTitle: string;
  message: string;
}

export interface ScheduleResponse {
  recommendedOrder: string[];
  warnings: ScheduleWarning[];
}