import type { IActividad } from 'src/types/actividad';
import type { ITourItem, ITourFilters } from 'src/types/tour';

import { orderBy } from 'es-toolkit';
import { useState, useEffect, useCallback } from 'react';
import { useBoolean, useSetState } from 'minimal-shared/hooks';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { fIsAfter, fIsBetween } from 'src/utils/format-time';

import { _tours } from 'src/_mock';
import { DashboardContent } from 'src/layouts/dashboard';

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { EmptyContent } from 'src/components/empty-content';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { TourSort } from '../tour-sort';
import { TourSearch } from '../tour-search';
import { TourFilters } from '../tour-filters';
import { ActividadesList } from '../actividad-list';
import { TourFiltersResult } from '../tour-filters-result';

// ----------------------------------------------------------------------

export function ActividadListaView() {
  const openFilters = useBoolean();

  const [sortBy, setSortBy] = useState('latest');
  const [actividades, setActividades] = useState<IActividad[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchActividades = async () => {
    try {
      const response = await fetch('http://localhost:3000/actividades');
      const data = await response.json();
      console.log(JSON.stringify(data));
      setActividades(data.items);
    } catch (error) {
      console.error('Error fetching actividades:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActividades();
  }, []);

  const filters = useSetState<ITourFilters>({
    destination: [],
    tourGuides: [],
    services: [],
    startDate: null,
    endDate: null,
  });
  const { state: currentFilters } = filters;

  const dateError = fIsAfter(currentFilters.startDate, currentFilters.endDate);

  const dataFiltered = applyFilter({
    inputData: _tours,
    filters: currentFilters,
    sortBy,
    dateError,
  });

  const canReset =
    currentFilters.destination.length > 0 ||
    currentFilters.tourGuides.length > 0 ||
    currentFilters.services.length > 0 ||
    (!!currentFilters.startDate && !!currentFilters.endDate);

  const notFound = !dataFiltered.length && canReset;

  const handleSortBy = useCallback((newValue: string) => {
    setSortBy(newValue);
  }, []);

  const handleDeleteActividad = useCallback(async (id: number) => {
    try {
      await fetch(`http://localhost:3000/actividades/${id}`, {
        method: 'DELETE',
      });
      setActividades((prevActividades) => prevActividades.filter((act) => act.id !== id));
      toast.success(`Actividad ${id} eliminada`);
    } catch (error) {
      console.error('Error eliminando actividad:', error);
      toast.error(`Error al eliminar actividad`);
    }
  }, []);

  const renderFilters = () => (
    <Box
      sx={{
        gap: 3,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: { xs: 'flex-end', sm: 'center' },
        flexDirection: { xs: 'column', sm: 'row' },
      }}
    >
      <TourSearch redirectPath={(id: string) => paths.dashboard.tour.details(id)} />

      <Box sx={{ gap: 1, flexShrink: 0, display: 'flex' }}>
        <TourFilters
          filters={filters}
          canReset={canReset}
          dateError={dateError}
          open={openFilters.value}
          onOpen={openFilters.onTrue}
          onClose={openFilters.onFalse}
          options={{
            tourGuides: [],
            services: [],
          }}
        />

        <TourSort sort={sortBy} onSort={handleSortBy} sortOptions={[]} />
      </Box>
    </Box>
  );

  const renderResults = () => (
    <TourFiltersResult filters={filters} totalResults={dataFiltered.length} />
  );

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Lista de Actividades"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Actividades', href: paths.dashboard.actividades.root },
          { name: 'Lista' },
        ]}
        action={
          <Button
            component={RouterLink}
            href={paths.dashboard.actividades.new}
            variant="contained"
            startIcon={<Iconify icon="mingcute:add-line" />}
          >
            Nueva Actividad
          </Button>
        }
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <Stack spacing={2.5} sx={{ mb: { xs: 3, md: 5 } }}>
        {renderFilters()}
        {canReset && renderResults()}
      </Stack>

      {loading ? (
        <EmptyContent filled sx={{ py: 10 }} />
      ) : notFound ? (
        <EmptyContent filled sx={{ py: 10 }} />
      ) : (
        <ActividadesList actividades={actividades} onDelete={handleDeleteActividad} />
      )}
    </DashboardContent>
  );
}

// ----------------------------------------------------------------------

type ApplyFilterProps = {
  sortBy: string;
  dateError: boolean;
  filters: ITourFilters;
  inputData: ITourItem[];
};

function applyFilter({ inputData, filters, sortBy, dateError }: ApplyFilterProps) {
  const { services, destination, startDate, endDate, tourGuides } = filters;

  const tourGuideIds = tourGuides.map((tourGuide) => tourGuide.id);

  // Sort by
  if (sortBy === 'latest') {
    inputData = orderBy(inputData, ['createdAt'], ['desc']);
  }

  if (sortBy === 'oldest') {
    inputData = orderBy(inputData, ['createdAt'], ['asc']);
  }

  if (sortBy === 'popular') {
    inputData = orderBy(inputData, ['totalViews'], ['desc']);
  }

  // Filters
  if (destination.length) {
    inputData = inputData.filter((tour) => destination.includes(tour.destination));
  }

  if (tourGuideIds.length) {
    inputData = inputData.filter((tour) =>
      tour.tourGuides.some((filterItem) => tourGuideIds.includes(filterItem.id))
    );
  }

  if (services.length) {
    inputData = inputData.filter((tour) => tour.services.some((item) => services.includes(item)));
  }

  if (!dateError) {
    if (startDate && endDate) {
      inputData = inputData.filter((tour) =>
        fIsBetween(startDate, tour.available.startDate, tour.available.endDate)
      );
    }
  }

  return inputData;
}
