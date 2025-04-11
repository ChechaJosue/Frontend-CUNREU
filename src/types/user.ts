import { z as zod } from 'zod';
import { isValidPhoneNumber } from 'react-phone-number-input/input';

import { schemaHelper } from 'src/components/hook-form';

import type { IDateValue, ISocialLink } from './common';

// ----------------------------------------------------------------------

export type IUserTableFilters = {
  name: string;
  role: string[];
  status: string;
};

export type IUserProfileCover = {
  name: string;
  role: string;
  coverUrl: string;
  avatarUrl: string;
};

export type IUserProfile = {
  id: string;
  role: string;
  quote: string;
  email: string;
  school: string;
  country: string;
  company: string;
  totalFollowers: number;
  totalFollowing: number;
  socialLinks: ISocialLink;
};

export type IUserProfileFollower = {
  id: string;
  name: string;
  country: string;
  avatarUrl: string;
};

export type IUserProfileGallery = {
  id: string;
  title: string;
  imageUrl: string;
  postedAt: IDateValue;
};

export type IUserProfileFriend = {
  id: string;
  name: string;
  role: string;
  avatarUrl: string;
};

export type IUserProfilePost = {
  id: string;
  media: string;
  message: string;
  createdAt: IDateValue;
  personLikes: { name: string; avatarUrl: string }[];
  comments: {
    id: string;
    message: string;
    createdAt: IDateValue;
    author: { id: string; name: string; avatarUrl: string };
  }[];
};

export type IUserCard = {
  id: string;
  name: string;
  role: string;
  coverUrl: string;
  avatarUrl: string;
  totalPosts: number;
  totalFollowers: number;
  totalFollowing: number;
};

// export interface IUsuario {
//   id: string;
//   nombres: string;
//   apellidos: string;
//   email: string;
//   rol: string;
//   estado: 'activo' | 'inactivo';
// }
export interface IUsuario {
  id: string;
  nombres: string;
  apellidos: string;
  direccion?: string;
  telefono: string;
  email: string;
  idTipoDocumentoIdentificacion?: number;
  documentoIdentificacion: string;
  imagen: string | File | null;
  fechaNacimiento: string;
  colegiado?: string;
  idProfesion?: number;
  idRol?: number;
  idMunicipio: number;
  estado: 'activo' | 'inactivo';
  rol: string;
}

export interface IUsuarioTableFilters {
  nombresApellidos: string;
  correo: string;
  estado: string[];
}

export type IUserItem = {
  id: string;
  name: string;
  city: string;
  role: string;
  email: string;
  state: string;
  status: string;
  address: string;
  country: string;
  zipCode: string;
  company: string;
  avatarUrl: string;
  phoneNumber: string;
  isVerified: boolean;
};

export type IUserAccountBillingHistory = {
  id: string;
  price: number;
  invoiceNumber: string;
  createdAt: IDateValue;
};

export const NewUserSchema = zod.object({
  nombres: zod.string().min(1, { message: '¡Los nombres son requeridos!' }),
  apellidos: zod.string().min(1, { message: '¡Los apellidos son requeridos!' }),
  direccion: zod.string().optional(),
  telefono: schemaHelper.phoneNumber({
    isValid: isValidPhoneNumber,
  }),
  email: zod
    .string()
    .min(1, { message: '¡Email es requerido!' })
    .email({ message: '¡Email debe ser una dirección válida!' }),
  idTipoDocumentoIdentificacion: zod.number(),
  documentoIdentificacion: zod
    .number()
    .min(1, { message: '¡Documento de identificación es requerido!' })
    .transform((val) => val.toString())
    .or(zod.string().min(1, { message: '¡Documento de identificación es requerido!' })),
  imagen: zod.union([zod.string(), zod.instanceof(File)]).optional(),
  fechaNacimiento: zod.string().min(1, { message: '¡Fecha de nacimiento es requerida!' }),
  colegiado: zod
    .number()
    .optional()
    .transform((val) => (val ? val.toString() : undefined))
    .or(
      zod
        .string()
        .optional()
        .transform((val) => {
          if (!val) return undefined;
          const num = Number(val);
          return isNaN(num) ? undefined : val;
        })
    ),
  idProfesion: zod.number().optional(),
  idRol: zod.number(),
  idDepartamento: zod.number().min(1, { message: '¡Departamento es requerido!' }),
  idMunicipio: zod.number().min(1, { message: '¡Municipio es requerido!' }),
  estado: zod.enum(['activo', 'inactivo']).optional(),
});

export type NewUserSchemaType = zod.infer<typeof NewUserSchema>;
