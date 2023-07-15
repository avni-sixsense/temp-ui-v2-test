import { faDatabase, faExternalLink } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Box from '@material-ui/core/Box';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import React from 'react';

const useStyles = makeStyles(theme => ({
  cardContainer: {
    backgroundColor: theme.colors.grey[0]
  },
  cardHeader: {
    fontSize: '0.875rem',
    fontWeight: 500,
    color: theme.colors.grey[16],
    marginRight: theme.spacing(2)
  },
  cardTime: {
    fontSize: '0.75rem',
    fontWeight: 500,
    color: theme.colors.grey[10]
  },
  cardsubHeader: {
    fontSize: '0.75rem',
    fontWeight: 400,
    color: theme.colors.grey[13]
  },
  icon: {
    fontSize: '0.875rem',
    fontWeight: 400,
    color: theme.colors.grey[10],
    cursor: 'pointer'
  },
  cardIconContainer: {
    borderRadius: '1000px',
    width: '40px',
    height: '40px',
    backgroundColor: theme.colors.grey[1]
  },
  read: {
    border: `1px solid ${theme.colors.grey[9]}`,
    '& svg': {
      color: theme.colors.grey[9]
    }
  },
  highPriority: {
    border: `1px solid ${theme.colors.red[500]}`,
    '& svg': {
      color: theme.colors.red[500]
    }
  },
  lowPriority: {
    border: `1px solid ${theme.colors.yellow[500]}`,
    '& svg': {
      color: theme.colors.yellow[500]
    }
  }
}));

const NotificationCards = ({
  title,
  subTitle,
  time,
  onClick,
  priority,
  isRead,
  ...rest
}) => {
  const classes = useStyles();
  return (
    <Box
      {...rest}
      width='100%'
      display='flex'
      alignItems='center'
      justifyContent='space-between'
      className={classes.cardContainer}
      py={1.875}
      pl={2}
      pr={8.75}
      mb={0.25}
    >
      <Box display='flex' alignItems='center'>
        <Box pr={1.5}>
          <Box
            display='flex'
            alignItems='center'
            justifyContent='center'
            className={`${classes.cardIconContainer} ${
              isRead
                ? classes.read
                : priority === 'High'
                ? classes.highPriority
                : classes.lowPriority
            }`}
          >
            <FontAwesomeIcon icon={faDatabase} />
          </Box>
        </Box>
        <Box>
          <Box display='flex' alignItems='flex-end' pb={1}>
            <Typography className={classes.cardHeader}>{title}</Typography>
            <Typography className={classes.cardTime}>{time}</Typography>
          </Box>
          <Box>
            <Typography className={classes.cardsubHeader}>
              {subTitle}
            </Typography>
          </Box>
        </Box>
      </Box>
      <Box onClick={onClick} className={classes.icon}>
        <FontAwesomeIcon icon={faExternalLink} />
      </Box>
    </Box>
  );
};

export default NotificationCards;
