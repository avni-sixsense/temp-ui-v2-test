import { createTheme, responsiveFontSizes } from '@material-ui/core/styles';
import Fonts from 'assests/reviewFonts';
import colors from 'styles/js/reviewColors';

import typeFace from './typeFace';

const theme = createTheme({
  props: {
    // Name of the component ⚛️
    MuiButtonBase: {
      // The properties to apply
      disableRipple: true // No more ripple, on the whole application 💣!
    }
  },
  palette: {
    primary: {
      main: '#02435D'
    },
    text: {
      primary: '#02435D'
    }
  },
  typography: {
    htmlFontSize: 16,
    fontFamily: ['IBM Plex Sans', 'cursive'].join(','),

    h1: {
      fontWeight: 500,
      letterSpacing: 'normal',
      fontSize: '1.375rem',
      color: '#02435D'
    },
    h2: {
      fontWeight: 'normal',
      fontSize: '1rem',
      color: '#02435D'
    },
    h3: {
      fontWeight: 'normal',
      fontSize: '0.875rem',
      color: '#02435D'
    },
    h4: {
      fontWeight: 'normal',
      fontSize: '0.875rem',
      color: '#4E7B8E'
    },
    h5: {
      fontWeight: 300,
      fontSize: '0.75rem',
      color: '#02435D'
    },
    // Important
    body1: {
      fontWeight: 500,
      fontSize: '0.75rem',
      color: '#000000'
    },
    // Normal
    body2: {
      fontWeight: 'normal',
      fontSize: '0.75rem',
      color: '#313131'
    },
    // Less Important
    subtitle1: {
      fontWeight: 'normal',
      fontSize: '0.75rem',
      color: '#6A6A6A'
    },
    // Very Less Important
    subtitle2: {
      fontWeight: 'normal',
      fontSize: '0.75rem',
      color: '#A3A3A3'
    },
    // filter text
    caption: {
      fontSize: '0.6875rem',
      color: '#878787',
      fontWeight: 'normal'
    }
  },
  colors: {
    ...colors
  },
  typeFace: { ...typeFace },
  overrides: {
    MuiCssBaseline: {
      '@global': {
        '@font-face': [
          Fonts.IBMPlexBold,
          Fonts.IBMPlexMedium,
          Fonts.IBMPlexRegular,
          Fonts.IBMPlexSemiBold
        ]
      }
    },
    MuiButton: {
      root: {
        textTransform: 'unset'
      }
    },
    MuiAppBar: {
      root: {
        height: '70px',
        justifyContent: 'center'
      }
    }
  }
});

const sixsenseTheme = responsiveFontSizes(theme);

export default sixsenseTheme;
