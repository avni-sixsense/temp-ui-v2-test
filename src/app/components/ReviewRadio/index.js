import { faDotCircle } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Box from '@material-ui/core/Box';
import Radio from '@material-ui/core/Radio';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import clsx from 'clsx';
import React from 'react';

const useStyles = makeStyles(theme => ({
  root: {
    padding: 0,
    marginRight: theme.spacing(0.75),
    marginTop: theme.spacing(0.25),
    '&:hover': {
      backgroundColor: 'transparent'
    },
    '& .MuiSvgIcon-root': {
      width: 20,
      height: 20
    },
    '&:focus': {
      '& span span, svg': {
        border: `1px solid ${theme.colors.blue[600]}`,
        boxShadow: `0px 0px 0px 2px #FFFFFF, 0px 0px 0px 4px #2563EB`
      }
    }
  },
  icon: {
    borderRadius: '50%',
    width: '0.875rem !important',
    height: '0.875rem !important',
    border: `1px solid ${theme.colors.grey[12]}`,
    backgroundColor: theme.colors.grey[14]
    // '&:focus': {
    // 	border: `1px solid ${theme.colors.blue[600]}`,
    // 	boxShadow: `0px 0px 0px 2px #FFFFFF, 0px 0px 0px 4px #2563EB`,
    // },
    // boxShadow: `0px 0px 0px 2px #FFFFFF, 0px 0px 0px 4px #2563EB`,
    // 'input:disabled ~ &': {
    // 	boxShadow: 'none',
    // 	background: 'rgba(206,217,224,.5)',
    // },
  },
  checkedIcon: {
    backgroundColor: theme.colors.blue[600],
    padding: theme.spacing(0.5),
    fontSize: theme.spacing(1),
    color: theme.colors.grey[0],
    width: '0.25rem !important',
    height: '0.25rem !important'
  },
  label: {
    fontSize: '0.8125rem',
    fontWeight: 600,
    color: theme.colors.grey[0],
    whiteSpace: 'nowrap'
  },
  subtitle: {
    fontSize: '0.875rem',
    fontWeight: 400,
    color: theme.colors.grey[9]
  },
  lightThemeLabel: {
    fontSize: '0.875rem',
    fontWeight: 600,
    color: theme.colors.grey[15],
    whiteSpace: 'nowrap'
  },
  lightThemeSubtitle: {
    fontSize: '0.8125rem',
    fontWeight: 400,
    color: theme.colors.grey[10]
  },
  lightThemeIcon: {
    borderRadius: 300,
    width: '0.875rem !important',
    height: '0.875rem !important',
    border: `1px solid ${theme.colors.grey[4]}`,
    backgroundColor: theme.colors.grey[2]
  },
  disabled: {
    opacity: 0.5
  }
}));

const CustomizedRadio = React.forwardRef(
  (
    {
      label,
      subtitle,
      lightTheme,
      wrapperClass = '',
      boxStyle = {},
      disabled,
      ...rest
    },
    ref
  ) => {
    const classes = useStyles(rest);
    const defaultRef = React.useRef();
    const resolvedRef = ref || defaultRef;

    return (
      // <StyledCheckbox {...props} />
      <Box
        display='flex'
        alignItems='center'
        className={wrapperClass}
        style={{ ...boxStyle }}
      >
        <Radio
          disableRipple
          disabled={disabled}
          className={classes.root}
          ref={resolvedRef}
          color='default'
          checkedIcon={
            <FontAwesomeIcon
              icon={faDotCircle}
              className={clsx(classes.icon, classes.checkedIcon)}
            />
          }
          icon={
            <span
              className={lightTheme ? classes.lightThemeIcon : classes.icon}
            />
          }
          {...rest}
        />
        <Box>
          {label && (
            <Typography
              className={clsx({
                [classes.lightThemeLabel]: lightTheme,
                [classes.label]: !lightTheme,
                [classes.disabled]: disabled
              })}
            >
              {label}
            </Typography>
          )}
          {subtitle && (
            <Typography
              className={clsx({
                [classes.lightThemeSubtitle]: lightTheme,
                [classes.subtitle]: !lightTheme,
                [classes.disabled]: disabled
              })}
            >
              {subtitle}
            </Typography>
          )}
        </Box>
      </Box>
      // <span className={clsx(classes.icon, classes.checkedIcon)} />
    );
  }
);

export default CustomizedRadio;
