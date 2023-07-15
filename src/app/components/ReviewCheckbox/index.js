import { faCheck, faMinus } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Box from '@material-ui/core/Box';
import Checkbox from '@material-ui/core/Checkbox';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import clsx from 'clsx';
import React, { useEffect } from 'react';

const useStyles = makeStyles(theme => ({
  root: {
    marginTop: theme.spacing(0.25),
    padding: 0,
    // marginRight: theme.spacing(1.625),
    '&:hover': {
      backgroundColor: 'transparent'
    },
    '& .MuiSvgIcon-root': {
      marginLeft: '-2px',
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
    borderRadius: 3,
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
  lightThemeIcon: {
    borderRadius: 3,
    width: '0.875rem !important',
    height: '0.875rem !important',
    border: `1px solid ${theme.colors.blue[4]}`,
    backgroundColor: theme.colors.grey[2]
  },
  whiteThemeIcon: {
    borderRadius: 3,
    width: '0.875rem !important',
    height: '0.875rem !important',
    border: `1px solid ${theme.colors.grey[6]}`,
    backgroundColor: theme.colors.grey[0]
  },
  checkedIcon: {
    backgroundColor: theme.colors.blue[600],
    padding: theme.spacing(0.25, 0.39, 0.40625, 0.375),
    fontSize: theme.spacing(1),
    color: theme.colors.grey[0],
    width: '0.5rem !important',
    height: '0.5rem !important'
  },
  label: {
    fontSize: '0.8125rem',
    fontWeight: 600,
    color: theme.colors.grey[0]
  },
  subtitle: {
    fontSize: '0.875rem',
    fontWeight: 400,
    color: theme.colors.grey[9]
  },
  lightThemeLabel: {
    fontSize: ({ smallLabel }) => (smallLabel ? '0.8125rem' : '0.875rem'),
    fontWeight: ({ smallLabel }) => (smallLabel ? 400 : 600),
    color: ({ smallLabel }) =>
      smallLabel ? theme.colors.grey[10] : theme.colors.grey[15]
  },
  lightThemeSubtitle: {
    fontSize: '0.8125rem',
    fontWeight: 400,
    color: theme.colors.grey[10]
  },
  disabled: { opacity: 0.5 }
}));

const CustomizedCheckbox = React.forwardRef(
  (
    { indeterminate, label, lightTheme, whiteTheme, subtitle, ...rest },
    ref
  ) => {
    const classes = useStyles(rest);
    const defaultRef = React.useRef();
    const resolvedRef = ref || defaultRef;

    useEffect(() => {
      if (resolvedRef.current) {
        resolvedRef.current.indeterminate = indeterminate;
      }
    }, [resolvedRef, indeterminate]);

    return (
      // <StyledCheckbox {...props} />
      <Box display='flex' alignItems='flex-start'>
        <Checkbox
          className={classes.root}
          classes={{ disabled: classes.disabled }}
          ref={resolvedRef}
          indeterminate={indeterminate}
          disableRipple
          color='default'
          indeterminateIcon={
            <FontAwesomeIcon
              className={clsx(
                classes.icon,
                classes.checkedIcon,
                'indeterminateIcon'
              )}
              icon={faMinus}
            />
          }
          checkedIcon={
            <FontAwesomeIcon
              className={clsx(
                classes.icon,
                classes.checkedIcon,
                'checkBoxIcon'
              )}
              icon={faCheck}
            />
          }
          icon={
            <span
              className={
                lightTheme
                  ? classes.lightThemeIcon
                  : whiteTheme
                  ? classes.whiteThemeIcon
                  : classes.icon
              }
            />
          }
          inputProps={{ 'aria-label': 'decorative checkbox' }}
          {...rest}
        />
        {label && (
          <Box
            ml={0.75}
            display='flex'
            alignItems='flex-start'
            flexDirection='column'
            className={clsx(rest.disabled && classes.disabled)}
          >
            {label && (
              <Typography
                className={
                  lightTheme || whiteTheme
                    ? classes.lightThemeLabel
                    : classes.label
                }
              >
                {label}
              </Typography>
            )}
            {subtitle && (
              <Typography
                className={
                  lightTheme || whiteTheme
                    ? classes.lightThemeSubtitle
                    : classes.subtitle
                }
              >
                {subtitle}
              </Typography>
            )}
          </Box>
        )}
      </Box>
      // <span className={clsx(classes.icon, classes.checkedIcon)} />
    );
  }
);

export default CustomizedCheckbox;
