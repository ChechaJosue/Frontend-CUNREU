import axiosInstance from '../axios';

import type { ListQueryParams, PaginatedResponse } from '../types';

export interface ITipoDocumentoAPI {
  id: number;
  nombre: string;
  estado: number;
}

export const TipoDocumentoService = {
  /**
   * Get all document types
   * @param params Query parameters for pagination
   * @returns Promise with paginated document types data
   */
  getTiposDocumento: async (
    params?: ListQueryParams
  ): Promise<PaginatedResponse<ITipoDocumentoAPI>> => {
    try {
      const response = await axiosInstance.get<PaginatedResponse<ITipoDocumentoAPI>>(
        '/tipo-documento-identificacion',
        {
          params,
        }
      );
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching tipos de documento:', error);
      throw error;
    }
  },

  /**
   * Get a single document type by ID
   * @param id Document type ID
   * @returns Promise with document type data
   */
  getTipoDocumentoById: async (id: number): Promise<ITipoDocumentoAPI> => {
    try {
      const response = await axiosInstance.get<ITipoDocumentoAPI>(
        `/tipo-documento-identificacion/${id}`
      );
      return response.data;
    } catch (error) {
      console.error(`Error fetching tipo de documento with ID ${id}:`, error);
      throw error;
    }
  },
};
