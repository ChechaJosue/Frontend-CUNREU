import type { BoxProps } from '@mui/material/Box';
import type { Breakpoint } from '@mui/material/styles';

import { mergeClasses } from 'minimal-shared/utils';

import Box from '@mui/material/Box';

import { layoutClasses } from '../core/classes';

// ----------------------------------------------------------------------

export type AuthSplitContentProps = BoxProps & { layoutQuery?: Breakpoint; isLogin?: boolean };

export function AuthSplitContent({
  sx,
  children,
  className,
  layoutQuery = 'md',
  isLogin = false,
  ...other
}: AuthSplitContentProps) {
  return (
    <Box
      className={mergeClasses([layoutClasses.content, className])}
      sx={[
        (theme) => ({
          display: 'flex',
          flex: '1 1 auto',
          alignItems: 'center',
          flexDirection: 'column',
          p: theme.spacing(3, 2, 10, 2),
          [theme.breakpoints.up(layoutQuery)]: {
            justifyContent: 'center',
            p: theme.spacing(10, 2, 10, 2),
          },
        }),
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...other}
    >
      <Box
        sx={{
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          maxWidth: isLogin ? '500px' : '800px',
          // padding: '2em',
          // maxWidth: 'var(--layout-auth-content-width)',
        }}
      >
        {children}
      </Box>
    </Box>
  );
}
