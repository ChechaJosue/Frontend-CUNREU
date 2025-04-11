import type { NewUserSchemaType } from 'src/types/user';
import type {
  IRolAPI,
  IUsuarioAPI,
  IProfesionAPI,
  IDepartamentoAPI,
  ITipoDocumentoAPI,
} from 'src/api';

import { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid2';
import Stack from '@mui/material/Stack';
import { MenuItem } from '@mui/material';
import Button from '@mui/material/Button';
import Switch from '@mui/material/Switch';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import FormControlLabel from '@mui/material/FormControlLabel';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { fData } from 'src/utils/format-number';

import {
  RolService,
  UsuarioService,
  ProfesionService,
  DepartamentoService,
  TipoDocumentoService,
} from 'src/api';

import { Label } from 'src/components/label';
import { toast } from 'src/components/snackbar';
import { Form, Field } from 'src/components/hook-form';
import { LoadingScreen } from 'src/components/loading-screen';

import { NewUserSchema } from 'src/types/user';

type Props = {
  currentUser?: IUsuarioAPI;
};

export function UserNewEditForm({ currentUser }: Props) {
  const router = useRouter();
  const [tiposDocumento, setTiposDocumento] = useState<ITipoDocumentoAPI[]>([]);
  const [profesiones, setProfesiones] = useState<IProfesionAPI[]>([]);
  const [roles, setRoles] = useState<IRolAPI[]>([]);
  const [departamentos, setDepartamentos] = useState<IDepartamentoAPI[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);

        // Fetch document types
        const tiposDocResponse = await TipoDocumentoService.getTiposDocumento();
        setTiposDocumento(tiposDocResponse.items);

        // Fetch professions
        const profesionesResponse = await ProfesionService.getProfesiones();
        setProfesiones(profesionesResponse.items);

        // Fetch roles
        const rolesResponse = await RolService.getRoles();
        setRoles(rolesResponse.items);

        // Fetch departamentos
        const departamentosResponse = await DepartamentoService.getDepartamentos({
          limit: 25,
        });
        setDepartamentos(departamentosResponse.items);
      } catch (error) {
        console.error('Error fetching form data:', error);
        toast.error('Error al cargar los datos del formulario');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const defaultValues: NewUserSchemaType = {
    nombres: '',
    apellidos: '',
    direccion: '',
    telefono: '',
    email: '',
    imagen: undefined,
    idTipoDocumentoIdentificacion: 0,
    documentoIdentificacion: '',
    fechaNacimiento: '',
    colegiado: '',
    idProfesion: undefined,
    idDepartamento: 0,
    idRol: 0,
    idMunicipio: 0,
    estado: 'activo',
  };

  const mappedCurrentUser = currentUser
    ? {
        ...currentUser,
        estado: currentUser.estado === 1 ? 'activo' : 'inactivo',
        idDepartamento: currentUser.municipio.idDepartamento,
        imagen: currentUser.imagen
          ? `http://localhost:3000/usuario/${currentUser.id}/imagen`
          : undefined,
      }
    : undefined;

  const methods = useForm<NewUserSchemaType>({
    mode: 'onSubmit',
    resolver: zodResolver(NewUserSchema),
    defaultValues,
    values: mappedCurrentUser as any,
  });

  const {
    reset,
    watch,
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  // Watch for changes in the selected department
  const selectedDepartamentoId = watch('idDepartamento');
  const selectedTipoDoc = watch('idTipoDocumentoIdentificacion');
  const isDPI = tiposDocumento.find((tipo) => tipo.id === selectedTipoDoc)?.nombre === 'DPI';

  const values = watch();

  const onSubmit = handleSubmit(async (data) => {
    try {
      const { imagen, ...restData } = data;
      let userId: number;

      // Create or update user first
      if (currentUser) {
        await UsuarioService.updateUsuario(currentUser.id, {
          ...restData,
          estado: data.estado === 'activo' ? 1 : 0,
        });
        userId = currentUser.id;
      } else {
        const newUser = await UsuarioService.createUsuario({
          ...restData,
          fechaNacimiento: data.fechaNacimiento.split('T')[0],
          estado: 1,
        });
        userId = newUser.id;
      }

      if (imagen && imagen instanceof File) {
        const formData = new FormData();
        formData.append('imagen', imagen);

        await fetch(`http://localhost:3000/usuario/${userId}/imagen`, {
          method: 'POST',
          body: formData,
        });
      }

      toast.success(
        `Usuario ${data.nombres} ${currentUser ? 'actualizado' : 'creado'} correctamente`
      );
      router.push(paths.dashboard.user.list);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al guardar el usuario');
    }
  });

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>
        {currentUser && (
          <Grid size={{ xs: 12, md: 4 }}>
            <Card sx={{ pt: 10, pb: 5, px: 3 }}>
              <Label
                color={(values.estado === 'activo' && 'success') || 'error'}
                sx={{ position: 'absolute', top: 24, right: 24 }}
              >
                {values.estado}
              </Label>

              <Box sx={{ mb: 5 }}>
                <Field.UploadAvatar
                  name="imagen"
                  maxSize={3145728}
                  // value={
                  //   currentUser?.imagen
                  //     ? `http://localhost:3000/usuario/${currentUser.id}/imagen`
                  //     : null
                  // }
                  helperText={
                    <Typography
                      variant="caption"
                      sx={{
                        mt: 3,
                        mx: 'auto',
                        display: 'block',
                        textAlign: 'center',
                        color: 'text.disabled',
                      }}
                    >
                      Permitidos *.jpeg, *.jpg, *.png, *.gif
                      <br /> tamaño máximo de {fData(3145728)}
                    </Typography>
                  }
                />
              </Box>

              <FormControlLabel
                labelPlacement="start"
                control={
                  <Controller
                    name="estado"
                    control={control}
                    render={({ field }) => (
                      <Switch
                        {...field}
                        checked={field.value === 'activo'}
                        onChange={(event) =>
                          field.onChange(event.target.checked ? 'activo' : 'inactivo')
                        }
                      />
                    )}
                  />
                }
                label={
                  <>
                    <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                      Estado
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      Activar/Desactivar usuario
                    </Typography>
                  </>
                }
                sx={{
                  mx: 0,
                  mb: 3,
                  width: 1,
                  justifyContent: 'space-between',
                }}
              />

              <Stack sx={{ mt: 3, alignItems: 'center', justifyContent: 'center' }}>
                <Button variant="soft" color="error">
                  Eliminar usuario
                </Button>
              </Stack>
            </Card>
          </Grid>
        )}

        <Grid size={{ xs: 12, md: currentUser ? 8 : 12 }}>
          <Card sx={{ p: 3 }}>
            <Box
              sx={{
                rowGap: 3,
                columnGap: 2,
                display: 'grid',
                gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' },
              }}
            >
              <Field.Text name="nombres" label="Nombres" />
              <Field.Text name="apellidos" label="Apellidos" />
              <Field.Select
                name="idTipoDocumentoIdentificacion"
                label="Tipo de documento"
                placeholder="Seleccione un tipo"
                disabled={isLoading}
              >
                {tiposDocumento.map((tipo) => (
                  <MenuItem key={tipo.id} value={tipo.id}>
                    {tipo.nombre}
                  </MenuItem>
                ))}
              </Field.Select>
              <Field.Text
                name="documentoIdentificacion"
                label="Documento de identificación"
                // type={isDPI ? 'number' : 'text'}
                {...{
                  ...(isDPI
                    ? {
                        maxLength: 13,
                        type: 'number',
                      }
                    : {
                        type: 'text',
                      }),
                }}
              />
              <Field.Text
                name="email"
                label="Correo electrónico"
                placeholder="ejemplo@cunreu.com"
                type="email"
              />
              <Field.Phone
                name="telefono"
                label="Número de teléfono"
                placeholder="Ingrese un teléfono"
                country={!currentUser ? 'GT' : undefined}
              />
              <Field.Text
                name="direccion"
                label="Dirección"
                multiline
                rows={2}
                fullWidth
                sx={{ gridColumn: { sm: 'span 2' } }}
              />
              <Field.DatePicker name="fechaNacimiento" label="Fecha de nacimiento" />
              <Field.Select
                name="idProfesion"
                label="Profesión"
                placeholder="Seleccione una profesión"
                disabled={isLoading}
              >
                {profesiones.map((profesion) => (
                  <MenuItem key={profesion.id} value={profesion.id}>
                    {profesion.descripcion}
                  </MenuItem>
                ))}
              </Field.Select>
              <Field.Text name="colegiado" label="Número de colegiado" type="number" />
              <Field.Select
                name="idRol"
                label="Rol"
                placeholder="Seleccione un rol"
                disabled={isLoading}
              >
                {roles.map((rol) => (
                  <MenuItem key={rol.id} value={rol.id}>
                    {rol.nombre}
                  </MenuItem>
                ))}
              </Field.Select>
              <Field.Select
                name="idDepartamento"
                label="Departamento"
                placeholder="Seleccione un departamento"
                disabled={isLoading}
              >
                {departamentos.map((departamento) => (
                  <MenuItem key={departamento.id} value={departamento.id}>
                    {departamento.nombre}
                  </MenuItem>
                ))}
              </Field.Select>
              <Field.Select
                name="idMunicipio"
                label="Municipio"
                placeholder="Seleccione un municipio"
                disabled={!selectedDepartamentoId}
              >
                {departamentos
                  .find((departamento) => departamento.id === selectedDepartamentoId)
                  ?.municipios?.map((municipio) => (
                    <MenuItem key={municipio.id} value={municipio.id}>
                      {municipio.nombre}
                    </MenuItem>
                  ))}
              </Field.Select>
            </Box>

            <Stack sx={{ mt: 3, alignItems: 'flex-end' }}>
              <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                {!currentUser ? 'Crear usuario' : 'Guardar cambios'}
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </Form>
  );
}
