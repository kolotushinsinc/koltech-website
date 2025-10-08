import axios from 'axios';
import type { Project, ContactFormData } from '../types';

// Создаем экземпляр axios с базовой конфигурацией
const api = axios.create({
  baseURL: 'https://api.koltech.dev/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Сервисы для работы с проектами
export const projectService = {
  getProjects: async (): Promise<Project[]> => {
    try {
      const response = await api.get('/projects');
      if (response.data.success) {
        // Проверяем, что response.data.projects - это массив
        const projects = response.data.projects || [];
        return Array.isArray(projects) ? projects : [];
      }
      throw new Error(response.data.message || 'Ошибка при получении проектов');
    } catch (error) {
      console.error('Error fetching projects:', error);
      throw error;
    }
  },

  getProject: async (id: string): Promise<Project> => {
    try {
      const response = await api.get(`/projects/${id}`);
      if (response.data.success) {
        return response.data.project;
      }
      throw new Error(response.data.message || 'Ошибка при получении проекта');
    } catch (error) {
      console.error('Error fetching project:', error);
      throw error;
    }
  },
};

// Сервисы для работы с контактной формой
export const contactService = {
  submitForm: async (formData: ContactFormData): Promise<void> => {
    try {
      const response = await api.post('/contacts', formData);
      if (!response.data.success) {
        throw new Error(response.data.message || 'Ошибка при отправке сообщения');
      }
      return response.data;
    } catch (error) {
      console.error('Error submitting contact form:', error);
      throw error;
    }
  },
};

export default api;