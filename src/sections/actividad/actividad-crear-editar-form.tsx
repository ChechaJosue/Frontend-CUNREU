import { z as zod } from 'zod';
import { useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import { InputAdornment } from '@mui/material';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { fIsAfter } from 'src/utils/format-time';

import axios from 'src/lib/axios';

import { toast } from 'src/components/snackbar';
import { Form, Field, schemaHelper } from 'src/components/hook-form';

// ----------------------------------------------------------------------

export type NuevaActividadSchemaType = zod.infer<typeof NuevaActividadSchema>;

export const NuevaActividadSchema = zod
  .object({
    capacitador: zod.string().min(1, { message: 'El capacitador es requerido' }),
    dpi: zod.coerce
      .string()
      .min(1, { message: 'El DPI es requerido' })
      .max(20, { message: 'El DPI es inválido' }),
    descripcion: zod
      .string()
      .min(10, { message: 'La descripción debe tener al menos 10 caracteres' })
      .max(200, { message: 'La descripción debe tener como máximo 200 caracteres' }),
    imagen: zod.string().optional(),
    costo: zod.number({ coerce: true }).optional(),
    horas: zod.number({ coerce: true }).optional(),
    fechaInicio: schemaHelper.date({ message: { required: 'La fecha de inicio es requerida' } }),
    fechaFinal: schemaHelper.date({
      message: { required: 'La fecha de finalización es requerida' },
    }),
  })
  .refine((data) => !fIsAfter(data.fechaInicio, data.fechaFinal), {
    message: 'La fecha de finalización no puede ser anterior a la fecha de inicio',
    path: ['fechaFinal'],
  });

// ----------------------------------------------------------------------

type Props = {
  // currentActividad?: Omit<IActividad, 'id'>;
  currentActividad?: {
    descripcion: string;
    capacitador: string;
    dpi: string;
    horas: number | undefined;
    imagen?: string;
    costo: number | undefined;
    fechaInicio: string | number | Date | null;
    fechaFinal: string | number | Date | null;
  };
};

export function ActividadCrearEditarForm({ currentActividad }: Props) {
  const router = useRouter();

  const defaultValues: NuevaActividadSchemaType = {
    descripcion: '',
    horas: undefined,
    dpi: '',
    capacitador: '',
    imagen: undefined,
    fechaInicio: null,
    fechaFinal: null,
    costo: undefined,
  };

  const methods = useForm<NuevaActividadSchemaType>({
    mode: 'all',
    resolver: zodResolver(NuevaActividadSchema),
    defaultValues,
    values: currentActividad,
  });

  const {
    watch,
    reset,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  const onSubmit = handleSubmit(async (data) => {
    try {
      const mappedData = {
        descripcion: data.descripcion,
        fechaInicio: data.fechaInicio
          ? new Date(data.fechaInicio).toISOString().split('T')[0]
          : null,
        fechaFinal: data.fechaFinal ? new Date(data.fechaFinal).toISOString().split('T')[0] : null,
        capacitador: data.capacitador,
        dpi: data.dpi,
        cantidadHoras: data.horas,
        costo: data.costo,
      };

      const response = await axios.post('http://localhost:3000/actividades', mappedData);
      console.log(JSON.stringify(response.data));

      if (response.data.id) {
        toast.success(
          currentActividad ? 'Actividad actualizada' : `Actividad ${response.data.id} creada`
        );
      } else {
        toast.warning('Error al guardar la actividad');
      }

      router.push(paths.dashboard.actividades.root);
    } catch (error) {
      console.error(error);
      toast.error('Error al guardar la actividad');
    }
  });

  // const handleRemoveFile = useCallback(
  //   (inputFile: File | string) => {
  //     const filtered = values.imagen && values.imagen?.filter((file) => file !== inputFile);
  //     setValue('imagen', filtered, { shouldValidate: true });
  //   },
  //   [setValue, values.imagen]
  // );

  const handleRemoveFile = useCallback(() => {
    setValue('imagen', undefined, { shouldValidate: true });
  }, [setValue]);

  const renderDetails = () => (
    <Card>
      <CardHeader title="Actividad" sx={{ mb: 3 }} />

      <Divider />

      <Stack spacing={3} sx={{ p: 3 }}>
        <Stack spacing={1.5}>
          <Typography variant="subtitle2">Descripción</Typography>
          <Field.Text name="descripcion" placeholder="Ej: Manejo de Químicos..." />
        </Stack>

        <Box
          sx={{
            rowGap: 3,
            columnGap: 2,
            display: 'grid',
            gridTemplateColumns: { xs: 'repeat(1, 1fr)', md: 'repeat(2, 1fr)' },
          }}
        >
          <Stack spacing={1.5}>
            <Typography variant="subtitle2">Capacitador</Typography>
            <Field.Text name="capacitador" placeholder="Ej: Juan Perez..." />
          </Stack>

          <Stack spacing={1.5}>
            <Typography variant="subtitle2">DPI</Typography>
            <Field.Text name="dpi" type="number" />
          </Stack>

          <Stack spacing={1.5}>
            <Typography variant="subtitle2">Fecha de inicio</Typography>
            <Field.DatePicker name="fechaInicio" />
          </Stack>
          <Stack spacing={1.5}>
            <Typography variant="subtitle2">Fecha de finalización</Typography>
            <Field.DatePicker name="fechaFinal" />
          </Stack>
          <Stack spacing={1.5}>
            <Typography variant="subtitle2">Cantidad de horas</Typography>
            <Field.Text
              name="horas"
              placeholder="0"
              type="number"
              slotProps={{ inputLabel: { shrink: true } }}
            />
          </Stack>
          <Stack spacing={1.5}>
            <Typography variant="subtitle2">Costo</Typography>
            <Field.Text
              name="costo"
              placeholder="0.00"
              type="number"
              slotProps={{
                inputLabel: { shrink: true },
                input: {
                  startAdornment: (
                    <InputAdornment position="start" sx={{ mr: 0.75 }}>
                      <Box component="span" sx={{ color: 'text.disabled' }}>
                        Q
                      </Box>
                    </InputAdornment>
                  ),
                },
              }}
            />
          </Stack>
        </Box>

        {/* <Stack spacing={1.5}>
          <Typography variant="subtitle2">Content</Typography>
          <Field.Editor name="content" sx={{ maxHeight: 480 }} />
        </Stack> */}

        <Stack spacing={1.5}>
          <Typography variant="subtitle2">Imagen</Typography>
          <Field.Upload
            multiple
            thumbnail
            name="images"
            maxSize={3145728}
            onRemove={handleRemoveFile}
            // onRemoveAll={handleRemoveAllFiles}
            onUpload={() => console.info('ON UPLOAD')}
          />
        </Stack>
      </Stack>
    </Card>
  );

  // const renderProperties = () => (
  //   <Card>
  //     <CardHeader
  //       title="Properties"
  //       subheader="Additional functions and attributes..."
  //       sx={{ mb: 3 }}
  //     />

  //     <Divider />

  //     <Stack spacing={3} sx={{ p: 3 }}>
  //       <div>
  //         <Typography variant="subtitle2" sx={{ mb: 1.5 }}>
  //           Tour guide
  //         </Typography>

  //         <Field.Autocomplete
  //           multiple
  //           name="tourGuides"
  //           placeholder="+ Tour Guides"
  //           disableCloseOnSelect
  //           options={_tourGuides}
  //           getOptionLabel={(option) => (option as ITourGuide).name}
  //           isOptionEqualToValue={(option, value) => option.id === value.id}
  //           renderOption={(props, tourGuide) => (
  //             <li {...props} key={tourGuide.id}>
  //               <Avatar
  //                 key={tourGuide.id}
  //                 alt={tourGuide.avatarUrl}
  //                 src={tourGuide.avatarUrl}
  //                 sx={{
  //                   mr: 1,
  //                   width: 24,
  //                   height: 24,
  //                   flexShrink: 0,
  //                 }}
  //               />

  //               {tourGuide.name}
  //             </li>
  //           )}
  //           renderTags={(selected, getTagProps) =>
  //             selected.map((tourGuide, index) => (
  //               <Chip
  //                 {...getTagProps({ index })}
  //                 key={tourGuide.id}
  //                 size="small"
  //                 variant="soft"
  //                 label={tourGuide.name}
  //                 avatar={<Avatar alt={tourGuide.name} src={tourGuide.avatarUrl} />}
  //               />
  //             ))
  //           }
  //         />
  //       </div>

  //       <Stack spacing={1.5}>
  //         <Typography variant="subtitle2">Available</Typography>
  //         <Box sx={{ gap: 2, display: 'flex', flexDirection: { xs: 'column', md: 'row' } }}>
  //           <Field.DatePicker name="available.startDate" label="Start date" />
  //           <Field.DatePicker name="available.endDate" label="End date" />
  //         </Box>
  //       </Stack>

  //       <Stack spacing={1.5}>
  //         <Typography variant="subtitle2">Duration</Typography>
  //         <Field.Text name="durations" placeholder="Ex: 2 days, 4 days 3 nights..." />
  //       </Stack>

  //       <Stack spacing={1.5}>
  //         <Typography variant="subtitle2">Destination</Typography>
  //         <Field.CountrySelect fullWidth name="destination" placeholder="+ Destination" />
  //       </Stack>

  //       <Stack spacing={1}>
  //         <Typography variant="subtitle2">Services</Typography>
  //         <Field.MultiCheckbox
  //           name="services"
  //           options={TOUR_SERVICE_OPTIONS}
  //           sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)' }}
  //         />
  //       </Stack>

  //       <Stack spacing={1.5}>
  //         <Typography variant="subtitle2">Tags</Typography>
  //         <Field.Autocomplete
  //           name="tags"
  //           placeholder="+ Tags"
  //           multiple
  //           freeSolo
  //           disableCloseOnSelect
  //           options={_tags.map((option) => option)}
  //           getOptionLabel={(option) => option}
  //           renderOption={(props, option) => (
  //             <li {...props} key={option}>
  //               {option}
  //             </li>
  //           )}
  //           renderTags={(selected, getTagProps) =>
  //             selected.map((option, index) => (
  //               <Chip
  //                 {...getTagProps({ index })}
  //                 key={option}
  //                 label={option}
  //                 size="small"
  //                 color="info"
  //                 variant="soft"
  //               />
  //             ))
  //           }
  //         />
  //       </Stack>
  //     </Stack>
  //   </Card>
  // );

  const renderActions = () => (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
      {/* <FormControlLabel
        label="Publish"
        control={<Switch defaultChecked inputProps={{ id: 'publish-switch' }} />}
        sx={{ flexGrow: 1, pl: 3 }}
      /> */}

      <LoadingButton
        type="submit"
        variant="contained"
        size="large"
        loading={isSubmitting}
        sx={{ ml: 2 }}
      >
        {!currentActividad ? 'Crear actividad' : 'Guardar cambios'}
      </LoadingButton>
    </Box>
  );

  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <Stack spacing={{ xs: 3, md: 5 }} sx={{ mx: 'auto', maxWidth: { xs: 720, xl: 880 } }}>
        {renderDetails()}
        {/* {renderProperties()} */}
        {renderActions()}
      </Stack>
    </Form>
  );
}
