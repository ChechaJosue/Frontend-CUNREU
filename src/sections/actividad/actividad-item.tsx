import type { CardProps } from '@mui/material/Card';
import type { IActividad } from 'src/types/actividad';

import { usePopover } from 'minimal-shared/hooks';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import { Typography } from '@mui/material';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';

import { RouterLink } from 'src/routes/components';

import { TRAVEL_IMAGES } from 'src/_mock';

import { Image } from 'src/components/image';
import { Iconify } from 'src/components/iconify';
import { CustomPopover } from 'src/components/custom-popover';
// ----------------------------------------------------------------------

type Props = CardProps & {
  actividad: IActividad;
  editHref: string;
  detailsHref: string;
  onDelete: (id: number) => void;
};

export function ActividadItem({ actividad, editHref, onDelete, detailsHref, sx, ...other }: Props) {
  const menuActions = usePopover();

  const renderImages = () => (
    <Box sx={{ p: 1, gap: 0.5, display: 'flex' }}>
      <Box sx={{ flexGrow: 1, position: 'relative' }}>
        {/* {renderPrice()} */}
        {/* {renderRating()} */}
        <Image
          alt={TRAVEL_IMAGES[0]}
          src="/assets/images/mock/travel/CUNREU-IMAGEN.jpg"
          sx={{ width: 1, height: 164, borderRadius: 1 }}
        />
      </Box>
    </Box>
  );

  const renderTexts = () => (
    <ListItemText
      sx={[(theme) => ({ p: theme.spacing(2.5, 2.5, 2, 2.5) })]}
      primary={
        <Typography
          variant="subtitle1"
          sx={{
            whiteSpace: 'normal',
            wordBreak: 'break-word',
            overflow: 'visible',
            color: actividad.descripcion ? 'text.primary' : 'gray',
          }}
        >
          {actividad.descripcion ? actividad.descripcion : 'Sin descripción'}
        </Typography>
      }
      slotProps={{
        primary: {
          component: 'div',
          sx: {
            color: 'text.primary',
            typography: 'subtitle1',
            wordBreak: 'break-word',
            whiteSpace: 'normal',
          },
        },
      }}
    />
  );

  const renderInfo = () => (
    <Box
      sx={[
        (theme) => ({
          gap: 1.5,
          display: 'flex',
          position: 'relative',
          flexDirection: 'column',
          p: theme.spacing(0, 2.5, 2.5, 2.5),
        }),
      ]}
    >
      <IconButton onClick={menuActions.onOpen} sx={{ position: 'absolute', bottom: 20, right: 8 }}>
        <Iconify icon="eva:more-vertical-fill" />
      </IconButton>

      {[
        {
          icon: <Iconify icon="material-symbols:info" sx={{ color: 'error.main' }} />,
          label: actividad.capacitador,
        },
        {
          icon: <Iconify icon="solar:clock-circle-bold" sx={{ color: 'info.main' }} />,
          label: `${actividad.fechaInicio} al ${actividad.fechaFinal}`,
          // label: fDateRangeShortLabel(tour.available.startDate, tour.available.endDate),
        },
        {
          icon: <Iconify icon="gridicons:money" sx={{ color: 'primary.main' }} />,
          label: actividad.costo ? `Q${actividad.costo}` : 'Gratis',
        },
      ].map((item) => (
        <Box
          key={item.label}
          sx={[{ gap: 0.5, display: 'flex', typography: 'body2', alignItems: 'center' }]}
        >
          {item.icon}
          {item.label}
        </Box>
      ))}
    </Box>
  );

  const renderMenuActions = () => (
    <CustomPopover
      open={menuActions.open}
      anchorEl={menuActions.anchorEl}
      onClose={menuActions.onClose}
      slotProps={{ arrow: { placement: 'right-top' } }}
    >
      <MenuList>
        <li>
          <MenuItem component={RouterLink} href={detailsHref} onClick={() => menuActions.onClose()}>
            <Iconify icon="solar:eye-bold" />
            Ver
          </MenuItem>
        </li>

        <li>
          <MenuItem component={RouterLink} href={editHref} onClick={() => menuActions.onClose()}>
            <Iconify icon="solar:pen-bold" />
            Editar
          </MenuItem>
        </li>

        <MenuItem
          onClick={() => {
            menuActions.onClose();
            onDelete(actividad.id);
          }}
          sx={{ color: 'error.main' }}
        >
          <Iconify icon="solar:trash-bin-trash-bold" />
          Eliminar
        </MenuItem>
      </MenuList>
    </CustomPopover>
  );

  return (
    <>
      <Card sx={sx} {...other}>
        {renderImages()}
        {renderTexts()}
        {renderInfo()}
      </Card>

      {renderMenuActions()}
    </>
  );
}
