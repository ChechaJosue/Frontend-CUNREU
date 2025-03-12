import type { IActividad } from 'src/types/actividad';

import Box from '@mui/material/Box';
import Pagination, { paginationClasses } from '@mui/material/Pagination';

import { paths } from 'src/routes/paths';

import { ActividadItem } from './actividad-item';

// ----------------------------------------------------------------------

type Props = {
  actividades: IActividad[];
  onDelete: (id: number) => Promise<void>;
};

export function ActividadesList({ actividades, onDelete }: Props) {
  return (
    <>
      <Box
        sx={{
          gap: 3,
          display: 'grid',
          gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
        }}
      >
        {actividades.map((actividad) => (
          <ActividadItem
            key={actividad.id}
            actividad={actividad}
            editHref={paths.dashboard.actividades.edit(`${actividad.id}`)}
            detailsHref={paths.dashboard.actividades.details(`${actividad.id}`)}
            onDelete={onDelete}
          />
        ))}
      </Box>

      {actividades.length > 8 && (
        <Pagination
          count={8}
          sx={{
            mt: { xs: 5, md: 8 },
            [`& .${paginationClasses.ul}`]: { justifyContent: 'center' },
          }}
        />
      )}
    </>
  );
}
