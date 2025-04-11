import type { BoxProps } from '@mui/material/Box';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';

export function SignUpTerms({ sx, ...other }: BoxProps) {
  return (
    <Box
      component="span"
      sx={[
        () => ({
          mt: 3,
          display: 'block',
          textAlign: 'center',
          typography: 'caption',
          color: 'text.secondary',
        }),
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...other}
    >
      {'Cuando te registras, aceptas nuestros '}
      <Link underline="always" color="text.primary">
        Terminos de servicio
      </Link>
      {' y '}
      <Link underline="always" color="text.primary">
        Politica de privacidad
      </Link>
      .
    </Box>
  );
}
