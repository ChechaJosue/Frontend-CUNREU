import type { IActividad } from 'src/types/actividad';

import { useCallback } from 'react';

import Box from '@mui/material/Box';
import Pagination, { paginationClasses } from '@mui/material/Pagination';

import { paths } from 'src/routes/paths';

import { ActividadItem } from './actividad-item';

// ----------------------------------------------------------------------

type Props = {
  actividades: IActividad[];
};

export function TourList({ actividades }: Props) {
  const handleDelete = useCallback((id: string) => {
    console.info('DELETE', id);
  }, []);

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
            editHref={paths.dashboard.tour.edit(`${actividad.id}`)}
            detailsHref={paths.dashboard.tour.details(`${actividad.id}`)}
            onDelete={() => handleDelete(`${actividad.id}`)}
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
// export function TourList({ tours, actividades }: Props) {
//   const handleDelete = useCallback((id: string) => {
//     console.info('DELETE', id);
//   }, []);

//   return (
//     <>
//       <Box
//         sx={{
//           gap: 3,
//           display: 'grid',
//           gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
//         }}
//       >
//         {tours.map((tour) => (
//           <TourItem
//             key={tour.id}
//             tour={tour}
//             editHref={paths.dashboard.tour.edit(tour.id)}
//             detailsHref={paths.dashboard.tour.details(tour.id)}
//             onDelete={() => handleDelete(tour.id)}
//           />
//         ))}
//       </Box>

//       {tours.length > 8 && (
//         <Pagination
//           count={8}
//           sx={{
//             mt: { xs: 5, md: 8 },
//             [`& .${paginationClasses.ul}`]: { justifyContent: 'center' },
//           }}
//         />
//       )}
//     </>
//   );
// }
