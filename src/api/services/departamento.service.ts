import axiosInstance from '../axios';

import type { ListQueryParams, PaginatedResponse } from '../types';

export interface IMunicipioAPI {
  id: number;
  nombre: string;
  idDepartamento: number;
}

export interface IDepartamentoAPI {
  id: number;
  nombre: string;
  municipios: IMunicipioAPI[];
}

export const DepartamentoService = {
  /**
   * Get all departments
   * @param params Query parameters for pagination
   * @returns Promise with paginated departments data
   */
  getDepartamentos: async (
    params?: ListQueryParams
  ): Promise<PaginatedResponse<IDepartamentoAPI>> => {
    try {
      const response = await axiosInstance.get<PaginatedResponse<IDepartamentoAPI>>(
        '/departamento',
        {
          params,
        }
      );
      console.log('departamentos', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching departamentos:', error);
      throw error;
    }
  },

  /**
   * Get a single department by ID
   * @param id Department ID
   * @returns Promise with department data
   */
  getDepartamentoById: async (id: number): Promise<IDepartamentoAPI> => {
    try {
      const response = await axiosInstance.get<IDepartamentoAPI>(`/departamento/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching departamento with ID ${id}:`, error);
      throw error;
    }
  },

  /**
   * Get municipalities by department ID
   * @param departamentoId Department ID
   * @returns Promise with municipalities data
   */
  getMunicipiosByDepartamento: async (departamentoId: number): Promise<IMunicipioAPI[]> => {
    try {
      const response = await axiosInstance.get<IDepartamentoAPI>(`/departamento/${departamentoId}`);
      return response.data.municipios || [];
    } catch (error) {
      console.error(`Error fetching municipios for departamento ID ${departamentoId}:`, error);
      throw error;
    }
  },
};
