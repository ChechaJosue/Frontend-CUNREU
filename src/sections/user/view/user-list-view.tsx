import type { IUsuarioTableFilters } from 'src/types/user';
import type { TableHeadCellProps } from 'src/components/table';
import type { IUsuarioAPI } from 'src/api/services/usuario.service';

import { useState, useEffect, useCallback } from 'react';
import { useBoolean, useSetState } from 'minimal-shared/hooks';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import TableBody from '@mui/material/TableBody';
import IconButton from '@mui/material/IconButton';
import CircularProgress from '@mui/material/CircularProgress';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { DashboardContent } from 'src/layouts/dashboard';
import { UsuarioService } from 'src/api/services/usuario.service';

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import {
  useTable,
  emptyRows,
  TableNoData,
  getComparator,
  TableEmptyRows,
  TableHeadCustom,
  TableSelectedAction,
  TablePaginationCustom,
} from 'src/components/table';

import { UserTableRow } from '../user-table-row';
import { UserTableFiltersResult } from '../user-table-filters-result';

// ----------------------------------------------------------------------

// Traducción de opciones de estado
// const STATUS_OPTIONS = [{ value: 'all', label: 'Todos' }, ...USUARIO_STATUS_OPTIONS];

const TABLE_HEAD: TableHeadCellProps[] = [
  { id: 'id', label: 'ID' },
  { id: 'nombres', label: 'Nombre' },
  { id: 'rol', label: 'Rol', width: 180 },
  { id: 'email', label: 'Correo' },
  { id: 'estado', label: 'Estado', width: 100 },
  { id: '', width: 88 },
];

// ----------------------------------------------------------------------

export function UserListView() {
  const table = useTable();
  const confirmDialog = useBoolean();
  const [loading, setLoading] = useState(false);
  const [tableData, setTableData] = useState<IUsuarioAPI[]>([]);
  const [paginationData, setPaginationData] = useState({
    total: 0,
    totalPages: 0,
  });

  const filters = useSetState<IUsuarioTableFilters>({
    nombres: '',
    apellidos: '',
    rol: [],
    estado: 'all',
  });
  const { state: currentFilters, setState: updateFilters } = filters;

  // Fetch users from API
  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const response = await UsuarioService.getUsuarios({
        page: table.page + 1,
        limit: table.rowsPerPage,
      });

      setTableData(response.items);
      setPaginationData({
        total: response.total,
        totalPages: response.totalPages,
      });
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Error al cargar los usuarios');
    } finally {
      setLoading(false);
    }
  }, [table.page, table.rowsPerPage, currentFilters]);

  // Initial fetch and refetch when dependencies change
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(table.order, table.orderBy),
    filters: currentFilters,
  });

  const canReset =
    !!currentFilters.nombres || currentFilters.rol.length > 0 || currentFilters.estado !== 'all';

  const notFound = (!dataFiltered.length && canReset) || !dataFiltered.length;

  const handleDeleteRow = useCallback(
    async (id: string | number) => {
      try {
        await UsuarioService.deleteUsuario(id);
        toast.success('¡Usuario desactivado con éxito!');
        fetchUsers(); // Refresh the list
      } catch (error) {
        console.error('Error deleting user:', error);
        toast.error('Error al desactivar el usuario');
      }
    },
    [fetchUsers]
  );

  const handleDeleteRows = useCallback(async () => {
    try {
      // Process deletions sequentially
      for (const id of table.selected) {
        await UsuarioService.deleteUsuario(id);
      }

      toast.success('¡Usuarios desactivados con éxito!');
      table.onSelectAllRows(false, []); // Clear selection
      fetchUsers(); // Refresh the list
    } catch (error) {
      console.error('Error deleting users:', error);
      toast.error('Error al desactivar los usuarios');
    }
  }, [table, fetchUsers]);

  const handleFilterStatus = useCallback(
    (event: React.SyntheticEvent, newValue: string) => {
      table.onResetPage();
      updateFilters({ estado: newValue });
    },
    [updateFilters, table]
  );

  const renderConfirmDialog = () => (
    <ConfirmDialog
      open={confirmDialog.value}
      onClose={confirmDialog.onFalse}
      title="Desactivar"
      content={
        <>
          ¿Está seguro que desea desactivar <strong> {table.selected.length} </strong> usuarios?
        </>
      }
      action={
        <Button
          variant="contained"
          color="error"
          onClick={() => {
            handleDeleteRows();
            confirmDialog.onFalse();
          }}
        >
          Desactivar
        </Button>
      }
    />
  );

  return (
    <>
      <DashboardContent>
        <CustomBreadcrumbs
          heading="Lista de Usuarios"
          links={[
            { name: 'Dashboard', href: paths.dashboard.root },
            { name: 'Usuarios', href: paths.dashboard.user.root },
            { name: 'Lista' },
          ]}
          action={
            <Button
              component={RouterLink}
              href={paths.dashboard.user.new}
              variant="contained"
              startIcon={<Iconify icon="mingcute:add-line" />}
            >
              Crear usuario
            </Button>
          }
          sx={{ mb: { xs: 3, md: 5 } }}
        />

        <Card>
          {canReset && (
            <UserTableFiltersResult
              filters={filters}
              totalResults={paginationData.total}
              onResetPage={table.onResetPage}
              sx={{ p: 2.5, pt: 0 }}
            />
          )}

          <Box sx={{ position: 'relative' }}>
            <TableSelectedAction
              dense={table.dense}
              numSelected={table.selected.length}
              rowCount={dataFiltered.length}
              onSelectAllRows={(checked) =>
                table.onSelectAllRows(
                  checked,
                  dataFiltered.map((row) => `${row.id}`)
                )
              }
              action={
                <Tooltip title="Desactivar">
                  <IconButton color="primary" onClick={confirmDialog.onTrue}>
                    <Iconify icon="solar:trash-bin-trash-bold" />
                  </IconButton>
                </Tooltip>
              }
            />

            <Scrollbar>
              {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', my: 5 }}>
                  <CircularProgress />
                </Box>
              ) : (
                <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 960 }}>
                  <TableHeadCustom
                    order={table.order}
                    orderBy={table.orderBy}
                    headCells={TABLE_HEAD}
                    rowCount={dataFiltered.length}
                    onSort={table.onSort}
                  />

                  <TableBody>
                    {dataFiltered
                      .slice(
                        table.page * table.rowsPerPage,
                        table.page * table.rowsPerPage + table.rowsPerPage
                      )
                      .map((row) => (
                        <UserTableRow
                          key={row.id}
                          row={row}
                          selected={table.selected.includes(String(row.id))}
                          onSelectRow={() => table.onSelectRow(String(row.id))}
                          onDeleteRow={() => handleDeleteRow(row.id)}
                          editHref={paths.dashboard.user.edit(String(row.id))}
                        />
                      ))}

                    <TableEmptyRows
                      height={table.dense ? 56 : 56 + 20}
                      emptyRows={emptyRows(table.page, table.rowsPerPage, dataFiltered.length)}
                    />

                    <TableNoData notFound={notFound} />
                  </TableBody>
                </Table>
              )}
            </Scrollbar>
          </Box>

          <TablePaginationCustom
            page={table.page}
            dense={table.dense}
            count={paginationData.total}
            rowsPerPage={table.rowsPerPage}
            onPageChange={table.onChangePage}
            onChangeDense={table.onChangeDense}
            onRowsPerPageChange={table.onChangeRowsPerPage}
            labelRowsPerPage="Filas por página:"
            labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count}`}
          />
        </Card>
      </DashboardContent>

      {renderConfirmDialog()}
    </>
  );
}

// ----------------------------------------------------------------------

type ApplyFilterProps = {
  inputData: IUsuarioAPI[];
  filters: IUsuarioTableFilters;
  comparator: (a: any, b: any) => number;
};

// Since filtering is now handled by the API, this function is simplified
function applyFilter({ inputData, comparator }: ApplyFilterProps) {
  const stabilizedThis = inputData.map((el, index) => [el, index] as const);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  return stabilizedThis.map((el) => el[0]);
}
