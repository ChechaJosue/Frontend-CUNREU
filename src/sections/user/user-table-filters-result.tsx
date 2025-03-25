import type { IUsuarioTableFilters } from 'src/types/user';
import type { UseSetStateReturn } from 'minimal-shared/hooks';
import type { FiltersResultProps } from 'src/components/filters-result';

import { useCallback } from 'react';

import Chip from '@mui/material/Chip';

import { chipProps, FiltersBlock, FiltersResult } from 'src/components/filters-result';

type Props = FiltersResultProps & {
  onResetPage: () => void;
  filters: UseSetStateReturn<IUsuarioTableFilters>;
};

export function UserTableFiltersResult({ filters, onResetPage, totalResults, sx }: Props) {
  const { state: currentFilters, setState: updateFilters, resetState: resetFilters } = filters;

  const handleRemoveNombresApellidos = useCallback(() => {
    onResetPage();
    updateFilters({ nombresApellidos: '' });
  }, [onResetPage, updateFilters]);

  const handleRemoveCorreo = useCallback(() => {
    onResetPage();
    updateFilters({ correo: '' });
  }, [onResetPage, updateFilters]);

  const handleRemoveEstado = useCallback(
    (inputValue: string) => {
      const newValue = currentFilters.estado.filter((item) => item !== inputValue);
      onResetPage();
      updateFilters({ estado: newValue });
    },
    [onResetPage, updateFilters, currentFilters.estado]
  );

  const handleReset = useCallback(() => {
    onResetPage();
    resetFilters();
  }, [onResetPage, resetFilters]);

  return (
    <FiltersResult totalResults={totalResults} onReset={handleReset} sx={sx}>
      <FiltersBlock label="Estado:" isShow={!!currentFilters.estado.length}>
        {currentFilters.estado.map((item) => (
          <Chip
            {...chipProps}
            key={item}
            label={item}
            onDelete={() => handleRemoveEstado(item)}
            sx={{ textTransform: 'capitalize' }}
          />
        ))}
      </FiltersBlock>

      <FiltersBlock label="Búsqueda:" isShow={!!currentFilters.nombresApellidos}>
        <Chip
          {...chipProps}
          label={currentFilters.nombresApellidos}
          onDelete={handleRemoveNombresApellidos}
        />
      </FiltersBlock>

      <FiltersBlock label="Correo:" isShow={!!currentFilters.correo}>
        <Chip {...chipProps} label={currentFilters.correo} onDelete={handleRemoveCorreo} />
      </FiltersBlock>
    </FiltersResult>
  );
}
