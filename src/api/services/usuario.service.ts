import axiosInstance from '../axios';

import type { ListQueryParams, PaginatedResponse } from '../types';

export interface IUsuarioAPI {
  id: number;
  nombres: string;
  apellidos: string;
  direccion?: string;
  telefono: string;
  email: string;
  idTipoDocumentoIdentificacion: number;
  documentoIdentificacion: string;
  imagen?: string;
  fechaNacimiento: string;
  estado: number;
  colegiado?: string;
  idProfesion?: number;
  idRol: number;
  idMunicipio: number;
  tipoDocumentoIdentificacion: {
    id: number;
    nombre: string;
    estado: number;
  };
  profesion: {
    id: number;
    descripcion: string;
    estado: number;
  };
  rol: {
    id: number;
    nombre: string;
  };
  municipio: {
    id: number;
    nombre: string;
    idDepartamento: number;
  };
}

export const UsuarioService = {
  /**
   * Get paginated list of users
   * @param params Query parameters for pagination and filtering
   * @returns Promise with paginated user data
   */
  getUsuarios: async (params: ListQueryParams): Promise<PaginatedResponse<IUsuarioAPI>> => {
    console.log('params', params);
    try {
      const response = await axiosInstance.get<PaginatedResponse<IUsuarioAPI>>(`/usuario`, {
        params,
        headers: {
          'Content-Type': 'application/json',
        },
      });
      console.log('response', response);
      return response.data;
    } catch (error) {
      console.error('Error fetching usuarios:', error);
      throw error;
    }
  },

  /**
   * Get a single user by ID
   * @param id User ID
   * @returns Promise with user data
   */
  getUsuarioById: async (id: string | number): Promise<IUsuarioAPI> => {
    try {
      const response = await axiosInstance.get<IUsuarioAPI>(`/usuario/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching usuario with ID ${id}:`, error);
      throw error;
    }
  },

  /**
   * Create a new user
   * @param usuario User data
   * @returns Promise with created user
   */
  createUsuario: async (
    usuario: Omit<
      IUsuarioAPI,
      'id' | 'tipoDocumentoIdentificacion' | 'profesion' | 'rol' | 'municipio'
    >
  ): Promise<IUsuarioAPI> => {
    console.log('create usuario input', usuario);
    try {
      const response = await axiosInstance.post<IUsuarioAPI>(`/usuario`, usuario, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      console.log('create usuario', response);
      return response.data;
    } catch (error) {
      console.error('Error creating usuario:', error);
      throw error;
    }
  },

  /**
   * Update an existing user
   * @param id User ID
   * @param usuario User data to update
   * @returns Promise with updated user
   */
  updateUsuario: async (
    id: string | number,
    usuario: Partial<
      Omit<IUsuarioAPI, 'id' | 'tipoDocumentoIdentificacion' | 'profesion' | 'rol' | 'municipio'>
    >
  ): Promise<IUsuarioAPI> => {
    try {
      const response = await axiosInstance.put<IUsuarioAPI>(`/usuario/${id}`, usuario, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return response.data;
    } catch (error) {
      console.error(`Error updating usuario with ID ${id}:`, error);
      throw error;
    }
  },

  /**
   * Delete a user
   * @param id User ID
   * @returns Promise with deletion result
   */
  deleteUsuario: async (id: string | number): Promise<void> => {
    try {
      await axiosInstance.delete(`/usuario/${id}`);
    } catch (error) {
      console.error(`Error deleting usuario with ID ${id}:`, error);
      throw error;
    }
  },
};
