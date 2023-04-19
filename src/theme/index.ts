import { createTheme } from '@mui/material';
import { Roboto } from 'next/font/google';

const { breakpoints } = createTheme();

const font = Roboto({
  weight: ['400', '500', '700', '900'],
  subsets: ['latin'],
});

const theme = createTheme({
  typography: {
    fontFamily: font.style.fontFamily,
  },
  palette: {},
  components: {
    MuiAppBar: {
      styleOverrides: {
        colorDefault: {
          backgroundColor: '#fff',
        },
      },
    },
    MuiCssBaseline: {
      styleOverrides: {
        'html, body': {
          margin: 0,
        },
        html: {
          fontSize: 16,
          [breakpoints.up('xl')]: {
            fontSize: 18,
          },
          [breakpoints.down('md')]: {
            fontSize: 16,
          },
          [breakpoints.down('sm')]: {
            fontSize: 14,
          },
        },
        '#__next': {
          position: 'relative',
        },
        'html, body, #__next': {
          overflow: 'hidden',
          height: '100%',
        },
        '*, ::before, ::after': {
          boxSizing: 'border-box',
        },
        p: {
          margin: 0,
        },
        a: {
          textDecoration: 'none',
        },
      },
    },
  },
});

export default theme;
