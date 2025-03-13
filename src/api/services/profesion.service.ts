import axiosInstance from '../axios';

import type { ListQueryParams, PaginatedResponse } from '../types';

export interface IProfesionAPI {
  id: number;
  descripcion: string;
  estado: number;
}

export const ProfesionService = {
  /**
   * Get all professions
   * @param params Query parameters for pagination
   * @returns Promise with paginated professions data
   */
  getProfesiones: async (params?: ListQueryParams): Promise<PaginatedResponse<IProfesionAPI>> => {
    try {
      const response = await axiosInstance.get<PaginatedResponse<IProfesionAPI>>('/profesion', {
        params,
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching profesiones:', error);
      throw error;
    }
  },

  /**
   * Get a single profession by ID
   * @param id Profession ID
   * @returns Promise with profession data
   */
  getProfesionById: async (id: number): Promise<IProfesionAPI> => {
    try {
      const response = await axiosInstance.get<IProfesionAPI>(`/profesion/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching profesion with ID ${id}:`, error);
      throw error;
    }
  },
};
