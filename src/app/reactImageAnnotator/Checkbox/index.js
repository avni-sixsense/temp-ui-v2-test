import React from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import Checkbox from '@material-ui/core/Checkbox';

const useStyles = makeStyles(theme => ({
  root: {
    padding: 7,
    '&:hover': {
      backgroundColor: 'transparent'
    },
    '& .MuiSvgIcon-root': {
      marginLeft: '-4px'
    }
  },
  icon: {
    borderRadius: 2,
    width: props => (props.size ? 13 : 16),
    height: props => (props.size ? 13 : 16),
    border: '1px solid rgba(2, 67, 93, 0.3)',
    backgroundColor: '#fff',
    'input:disabled ~ &': {
      boxShadow: 'none',
      background: 'rgba(206,217,224,.5)'
    }
  },
  checkedIcon: {
    backgroundColor: theme.palette.primary.main,
    '&:before': {
      display: 'block',
      width: props => (props.size ? 11 : 15),
      height: props => (props.size ? 12 : 15),
      borderRadius: 2,
      backgroundImage:
        "url(\"data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Cpath" +
        " fill-rule='evenodd' clip-rule='evenodd' d='M12 5c-.28 0-.53.11-.71.29L7 9.59l-2.29-2.3a1.003 " +
        "1.003 0 00-1.42 1.42l3 3c.18.18.43.29.71.29s.53-.11.71-.29l5-5A1.003 1.003 0 0012 5z' fill='%23fff'/%3E%3C/svg%3E\")",
      content: '""'
    }
  }
}));

function StyledCheckbox(props) {
  const classes = useStyles(props);

  return (
    <Checkbox
      className={classes.root}
      disableRipple
      color='default'
      checkedIcon={<span className={clsx(classes.icon, classes.checkedIcon)} />}
      icon={<span className={classes.icon} />}
      inputProps={{ 'aria-label': 'decorative checkbox' }}
      {...props}
    />
  );
}

export default function CustomizedCheckbox(props) {
  return <StyledCheckbox {...props} />;
}
