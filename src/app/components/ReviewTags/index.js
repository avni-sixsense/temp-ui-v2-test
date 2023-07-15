import clsx from 'clsx';

import { makeStyles } from '@material-ui/core/styles';
import { IconButton } from '@material-ui/core';

import TruncateText from '../TruncateText';

import Box from '@material-ui/core/Box';

import { faTimes } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const useStyles = makeStyles(theme => ({
  root: {
    borderRadius: 4,
    boxShadow: theme.colors.shadow.base,
    height: '100%',
    maxWidth: props => props.maxWidth ?? '100%'
  },
  icon: {
    padding: theme.spacing(0, 0.25, 0, 0.25),
    '& svg': {
      color: theme.colors.grey[0],
      opacity: theme.colors.opacity['8']
    }
  },
  greyIcon: {
    padding: theme.spacing(0, 0.25, 0, 0.25),
    '& svg': {
      color: theme.colors.grey[11]
    }
  },
  lightGreyIcon: {
    padding: theme.spacing(0, 0.3125, 0, 0.3125),
    fontSize: '0.5rem',
    fontWeight: 900,
    '& svg': {
      color: theme.colors.grey[8]
    }
  },
  whiteFont: {
    color: theme.colors.grey[0],
    whiteSpace: 'nowrap'
  },
  blackFont: {
    color: theme.colors.grey[19],
    whiteSpace: 'nowrap'
  },
  closeIcon: {
    padding: theme.spacing(0, 0.375, 0, 0.625),
    fontSize: '0.5rem',
    color: theme.colors.grey[0],
    opacity: theme.colors.opacity['5']
  },
  closeIconGrey: {
    padding: theme.spacing(0, 0.375, 0, 0.625),
    fontSize: '0.5rem',
    color: theme.colors.grey[10],
    opacity: theme.colors.opacity['5']
  },
  extraSmall: {
    padding: theme.spacing(0, 0.5, 0.125, 0.5),
    '& p': {
      fontSize: '0.75rem',
      fontWeight: 600
    }
  },
  small: {
    padding: theme.spacing(0, 0.5, 0.125, 0.5),
    '& p': {
      fontSize: '0.75rem',
      fontWeight: 600
    }
  },
  medium: {
    padding: theme.spacing(0.125, 0.5, 0.375, 0.5),
    '& p': {
      fontSize: '0.8125rem',
      fontWeight: 600
    }
  },
  large: {
    padding: theme.spacing(0.125, 0.5, 0.375, 0.5),
    '& p': {
      fontSize: '0.875rem',
      fontWeight: 600
    }
  },
  blue: {
    backgroundColor: theme.colors.blue[600]
  },
  indigo: {
    backgroundColor: theme.colors.indigo[600]
  },
  violet: {
    backgroundColor: theme.colors.violet[600]
  },
  // lightBlue: {
  // 	backgroundColor: theme.colors.lightBlue[600],
  // },
  // cyan: {
  // 	backgroundColor: theme.colors.cyan[600],
  // },
  amber: {
    backgroundColor: theme.colors.yellow[600]
  },
  green: {
    backgroundColor: theme.colors.green[600]
  },
  grey: {
    backgroundColor: theme.colors.grey[13]
  },
  white: {
    backgroundColor: theme.colors.grey[0]
  },
  lightgrey: {
    backgroundColor: theme.colors.grey[3]
  },
  lightFont: {
    color: theme.colors.grey[18],
    whiteSpace: 'nowrap'
  },
  subLabel: {
    marginLeft: theme.spacing(0.5),
    padding: theme.spacing(0, 0.25),
    backgroundColor: theme.colors.yellow[700],
    borderRadius: theme.spacing(0.5)
  }
}));

const ReviewTags = ({
  icon,
  label = '',
  sublabel,
  size = 'small',
  removable = false,
  variant = 'blue',
  onClick,
  wrapperClass = '',
  maxWidth,
  showTooltip = true,
  isNoDefect
}) => {
  const classes = useStyles({ maxWidth });

  const textClassNames = {
    [classes.blackFont]: variant.toLowerCase() === 'white',
    [classes.whiteFont]: !(
      variant.toLowerCase() === 'white' || variant.toLowerCase() === 'lightgrey'
    ),
    [classes.lightFont]: variant.toLowerCase() === 'lightgrey'
  };

  return (
    <Box
      className={`${classes.root} ${classes[size.toLowerCase()]} ${
        classes[variant.toLowerCase()]
      } ${wrapperClass}`}
      display='flex'
      alignItems='center'
    >
      {icon && (
        <Box
          className={clsx({
            [classes.greyIcon]:
              variant.toLowerCase() === 'grey' ||
              variant.toLowerCase() === 'white',
            [classes.icon]: !(
              variant.toLowerCase() === 'grey' ||
              variant.toLowerCase() === 'white' ||
              variant.toLowerCase() === 'lightgrey'
            ),
            [classes.lightGreyIcon]: variant.toLowerCase() === 'lightgrey'
          })}
        >
          {icon}
        </Box>
      )}

      <TruncateText
        classNames={{
          root: textClassNames,
          subLabel: clsx(textClassNames, classes.subLabel)
        }}
        key={label}
        label={label}
        subLabel={sublabel ? parseFloat(sublabel).toFixed(2) : null}
        showToolTip={showTooltip}
      />

      {removable && (
        <IconButton
          onClick={onClick}
          className={clsx({
            [classes.closeIconGrey]:
              variant.toLowerCase() === 'white' ||
              variant.toLowerCase() === 'lightgrey',
            [classes.closeIcon]: !(
              variant.toLowerCase() === 'white' ||
              variant.toLowerCase() === 'lightgrey'
            )
            // [classes.lightGreyIcon]: variant.toLowerCase() === 'lightgrey',
          })}
        >
          {!isNoDefect && <FontAwesomeIcon icon={faTimes} />}
        </IconButton>
      )}
    </Box>
  );
};

export default ReviewTags;
