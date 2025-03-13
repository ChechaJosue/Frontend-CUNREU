import axiosInstance from '../axios';

import type { ListQueryParams, PaginatedResponse } from '../types';

export interface IRolAPI {
  id: number;
  nombre: string;
}

export const RolService = {
  /**
   * Get all roles
   * @param params Query parameters for pagination
   * @returns Promise with paginated roles data
   */
  getRoles: async (params?: ListQueryParams): Promise<PaginatedResponse<IRolAPI>> => {
    try {
      const response = await axiosInstance.get<PaginatedResponse<IRolAPI>>('/rol', {
        params,
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching roles:', error);
      throw error;
    }
  },

  /**
   * Get a single role by ID
   * @param id Role ID
   * @returns Promise with role data
   */
  getRolById: async (id: number): Promise<IRolAPI> => {
    try {
      const response = await axiosInstance.get<IRolAPI>(`/rol/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching rol with ID ${id}:`, error);
      throw error;
    }
  },
};
