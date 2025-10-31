import axios from 'axios';
import type { Task } from '../types/Task';


const API_BASE_URL = 'http://localhost:5107/api/tasks';

export const taskService = {
  getAllTasks: async (): Promise<Task[]> => {
    const response = await axios.get(API_BASE_URL);
    return response.data;
  },

  createTask: async (description: string): Promise<Task> => {
    const response = await axios.post(API_BASE_URL, {
      description,
      isCompleted: false,
    });
    return response.data;
  },

  updateTask: async (id: string, task: Task): Promise<void> => {
    await axios.put(`${API_BASE_URL}/${id}`, task);
  },

  deleteTask: async (id: string): Promise<void> => {
    await axios.delete(`${API_BASE_URL}/${id}`);
  },
};