import Box from '@material-ui/core/Box';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import { NumberFormater } from 'app/utils/helpers';
import clsx from 'clsx';

const useStyles = makeStyles(theme => ({
  toggle: {
    borderRadius: '1000px',
    backgroundColor: theme.colors.grey[14],
    cursor: 'pointer'
  },
  toggleBtn: {
    color: theme.colors.grey[0]
  },
  activeBtn: {
    backgroundColor: theme.colors.blue[600],
    borderRadius: '1000px'
  },
  blueLightActiveBtn: {
    backgroundColor: theme.colors.blue[600],
    borderRadius: '1000px',
    '& svg': {
      color: theme.colors.grey[6],
      marginRight: theme.spacing(0.75)
    }
  },
  noOutLinedActiveBtn: {
    '& svg': {
      color: theme.colors.grey[16],
      marginRight: theme.spacing(0.75)
    }
  },
  lightToggle: {
    borderRadius: '1000px',
    backgroundColor: theme.colors.grey[0],
    cursor: 'pointer',
    border: `0.8px solid ${theme.colors.grey[4]}`,
    boxShadow: theme.colors.shadow.sm
  },
  noOutLinedToggle: {
    backgroundColor: 'transparent',
    cursor: 'pointer'
  },
  lightToggleBtn: {
    color: theme.colors.grey[18]
  },
  noOutlinedToggleBtn: {
    color: theme.colors.grey[10],
    fontWeight: 400,
    fontSize: '0.875rem'
  },
  noOutlinedToggleBtnActive: {
    color: theme.colors.grey[16],
    fontWeight: 600,
    fontSize: '0.875rem'
  },
  blueLightToggleBtn: {
    color: theme.colors.grey[0]
  },
  lightActiveBtn: {
    backgroundColor: theme.colors.grey[3],
    borderRadius: '1000px',
    '& svg': {
      color: theme.colors.grey[6],
      marginRight: theme.spacing(0.75)
    }
  },
  inactiveBtn: {
    '& svg': {
      color: theme.colors.grey[6],
      marginRight: theme.spacing(0.75)
    }
  },
  noOutlinedInactiveBtn: {
    '& svg': {
      color: theme.colors.grey[10],
      marginRight: theme.spacing(0.75)
    }
  },
  subLabel: {
    borderRadius: '1000px',
    margin: theme.spacing(0.25, 'auto', 0.375, 0.375),
    padding: theme.spacing(0, 0.75),
    '& p': {
      fontWeight: 500,
      fontSize: '0.625rem'
    }
  },
  subLabelBg: {
    backgroundColor: theme.colors.grey[14],
    '& p': {
      color: theme.colors.grey[0]
    }
  },
  subLabelLightBg: {
    backgroundColor: theme.colors.blue[600],
    '& p': {
      color: theme.colors.grey[0]
    }
  },
  subLabelBlueLightBg: {
    backgroundColor: theme.colors.grey[12],
    '& p': {
      color: theme.colors.grey[0]
    }
  },
  subLabelNoOutlinedBg: {
    backgroundColor: theme.colors.grey[2],
    '& p': {
      color: theme.colors.grey[12],
      fontWeight: 500,
      fontSize: '0.625rem'
    }
  },
  noBg: {
    backgroundColor: 'transparent',
    cursor: 'pointer',
    border: 0,
    boxShadow: theme.colors.shadow.sm
  },
  activeUnderline: {
    borderBottom: `1px solid ${theme.colors.grey[0]}`,
    '& svg': {
      color: theme.colors.grey[0],
      marginRight: theme.spacing(0.75)
    }
  },
  underLineBtn: {
    color: theme.colors.grey[0],
    fontWeight: 600,
    fontSize: '0.8125rem'
  }
}));

const ModeSelector = ({
  onChange,
  active,
  modes = [],
  lightTheme = false,
  blueLightTheme = false,
  simpleUnderline = false,
  noOutLined = false
}) => {
  const classes = useStyles();

  return (
    <Box
      p={0.375}
      display='flex'
      className={clsx({
        [classes.noBg]: simpleUnderline,
        [classes.lightToggle]: lightTheme || blueLightTheme,
        [classes.noOutLinedToggle]: noOutLined,
        [classes.toggle]: !simpleUnderline && !lightTheme && !blueLightTheme
      })}
    >
      {modes.map((mode, index) => (
        <Box
          key={index}
          px={0.625}
          onClick={() => onChange(mode.label)}
          className={clsx({
            [classes.activeUnderline]: active === mode.label && simpleUnderline,
            [classes.lightActiveBtn]: active === mode.label && lightTheme,
            [classes.blueLightActiveBtn]:
              active === mode.label && blueLightTheme,
            [classes.noOutLinedActiveBtn]: active === mode.label && noOutLined,
            [classes.activeBtn]:
              active === mode.label &&
              !simpleUnderline &&
              !lightTheme &&
              !blueLightTheme &&
              !noOutLined,
            [classes.inactiveBtn]:
              active !== mode.label && (lightTheme || blueLightTheme),
            [classes.noOutlinedInactiveBtn]: active !== mode.label && noOutLined
          })}
          display='flex'
          alignItems='center'
        >
          {mode?.icon && mode.icon}

          <Typography
            className={clsx({
              [classes.underLineBtn]: simpleUnderline,
              [classes.lightToggleBtn]: lightTheme,
              [classes.blueLightToggleBtn]:
                active === mode.label && blueLightTheme,
              [classes.lightToggleBtn]: active !== mode.label && blueLightTheme,
              [classes.noOutlinedToggleBtn]:
                active !== mode.label && noOutLined,
              [classes.noOutlinedToggleBtnActive]:
                active === mode.label && noOutLined,
              [classes.toggleBtn]:
                !simpleUnderline &&
                !lightTheme &&
                !blueLightTheme &&
                !noOutLined
            })}
          >
            {mode.label}
          </Typography>

          {(mode.subLabel || mode.subLabel === 0) && (
            <Box
              className={clsx(classes.subLabel, {
                [classes.subLabelLightBg]: lightTheme,
                [classes.subLabelBlueLightBg]: blueLightTheme,
                [classes.subLabelNoOutlinedBg]: noOutLined,
                [classes.subLabelBg]:
                  !lightTheme && !blueLightTheme && !noOutLined
              })}
              mx={0.25}
              px={0.375}
              py={0.125}
            >
              <Typography>{NumberFormater(mode.subLabel)}</Typography>
            </Box>
          )}
        </Box>
      ))}
    </Box>
  );
};

export default ModeSelector;
