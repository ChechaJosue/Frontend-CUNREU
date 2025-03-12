import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { ActividadCrearEditarForm } from '../actividad-crear-editar-form';

// ----------------------------------------------------------------------

export function ActividadCrearView() {
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Crear nueva actividad"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Actividades', href: paths.dashboard.actividades.root },
          { name: 'Nueva actividad' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <ActividadCrearEditarForm />
    </DashboardContent>
  );
}
