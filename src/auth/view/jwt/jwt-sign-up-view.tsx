import { useForm } from 'react-hook-form';
import { useState, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid2';
import Alert from '@mui/material/Alert';
import { Card, MenuItem } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';

import {
  RolService,
  type IRolAPI,
  UsuarioService,
  ProfesionService,
  type IProfesionAPI,
  DepartamentoService,
  TipoDocumentoService,
  type IDepartamentoAPI,
  type ITipoDocumentoAPI,
} from 'src/api';

import { toast } from 'src/components/snackbar';
import { Form, Field } from 'src/components/hook-form';

import { NewUserSchema, type NewUserSchemaType } from 'src/types/user';

import { getErrorMessage } from '../../utils';
import { FormHead } from '../../components/form-head';
import { SignUpTerms } from '../../components/sign-up-terms';

export function JwtSignUpView() {
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

        const tiposDocResponse = await TipoDocumentoService.getTiposDocumento();
        setTiposDocumento(tiposDocResponse.items);

        const profesionesResponse = await ProfesionService.getProfesiones();
        setProfesiones(profesionesResponse.items);

        const rolesResponse = await RolService.getRoles();
        setRoles(rolesResponse.items);

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

  // const { checkUserSession } = useAuthContext();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  type UsuarioSinImagen = Omit<NewUserSchemaType, 'imagen'>;

  const defaultValues: UsuarioSinImagen = {
    nombres: '',
    apellidos: '',
    direccion: '',
    telefono: '',
    email: '',
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

  const methods = useForm<UsuarioSinImagen>({
    resolver: zodResolver(NewUserSchema),
    defaultValues,
  });

  const {
    watch,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const selectedDepartamentoId = watch('idDepartamento');
  const selectedTipoDoc = watch('idTipoDocumentoIdentificacion');
  const isDPI = tiposDocumento.find((tipo) => tipo.id === selectedTipoDoc)?.nombre === 'DPI';

  const onSubmit = handleSubmit(async (data) => {
    try {
      const idRolEstudiante = roles.find((rol) => rol.nombre === 'Estudiante')?.id;

      const newUser = await UsuarioService.createUsuario({
        ...data,
        fechaNacimiento: data.fechaNacimiento.split('T')[0],
        estado: 1,
        idRol: idRolEstudiante ?? 1,
      });

      console.log(newUser);
      // await checkUserSession?.();
      toast.success(`Usuario ${data.nombres} creado correctamente`);
      router.push(paths.auth.jwt.signIn);
    } catch (error) {
      console.error(error);
      const feedbackMessage = getErrorMessage(error);
      setErrorMessage(feedbackMessage);
    }
  });

  const renderForm = () => (
    <Grid container spacing={3}>
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
            country="GT"
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
          <Field.Text
            name="colegiado"
            label="Número de colegiado"
            type="number"
            sx={{ gridColumn: { sm: 'span 2' } }}
          />
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
        <Box sx={{ mt: 5 }}>
          <LoadingButton
            fullWidth
            color="inherit"
            size="large"
            type="submit"
            variant="contained"
            loading={isSubmitting}
            loadingIndicator="Creando cuenta..."
          >
            Crear cuenta
          </LoadingButton>
        </Box>
      </Card>
    </Grid>
  );

  return (
    <>
      <FormHead
        title="Crea tu cuenta"
        description={
          <>
            {`¿Ya tienes una cuenta? `}
            <Link component={RouterLink} href={paths.auth.jwt.signIn} variant="subtitle2">
              Inicia sesión
            </Link>
          </>
        }
        sx={{ textAlign: { xs: 'center', md: 'left' } }}
      />

      {!!errorMessage && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {errorMessage}
        </Alert>
      )}

      <Form methods={methods} onSubmit={onSubmit}>
        {renderForm()}
      </Form>

      <SignUpTerms />
    </>
  );
}
