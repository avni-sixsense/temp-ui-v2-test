import {
  faArrowToBottom,
  faCheckCircle,
  faExclamationTriangle
} from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { CircularProgress } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import CommonButton from 'app/components/ReviewButton';

const useStyles = makeStyles(theme => ({
  header: {
    fontSize: '0.875rem',
    fontWeight: 500,
    color: theme.colors.grey[16],
    wordWrap: 'break-word'
  },
  timestamp: {
    fontSize: '0.75rem',
    fontWeight: 500,
    color: theme.colors.grey[10]
  },
  circularProgress: {
    marginRight: theme.spacing(1),
    '& svg': {
      color: theme.colors.blue[600]
    }
  },
  failedIcon: {
    fontSize: '0.75rem',
    color: theme.colors.red[600],
    marginRight: theme.spacing(1)
  },
  successIcon: {
    fontSize: '0.75rem',
    color: theme.colors.green[600],
    marginRight: theme.spacing(1)
  }
}));

const TaskCard = ({
  title,
  status,
  timestamp,
  onRetryClick,
  taskName,
  url = null,
  ...rest
}) => {
  const classes = useStyles();
  const renderIcons = () => {
    switch (status) {
      case 'PENDING':
        return (
          <CircularProgress size={12} className={classes.circularProgress} />
        );

      case 'FAILURE':
        return (
          <FontAwesomeIcon
            icon={faExclamationTriangle}
            className={classes.failedIcon}
          />
        );

      case 'SUCCESS':
        return (
          <FontAwesomeIcon
            icon={faCheckCircle}
            className={classes.successIcon}
          />
        );

      default:
        return null;
    }
  };

  const downloadHandler = () => {
    const link = document.createElement('a');
    link.href = url;
    link.click();
  };

  const renderTitle = (
    <Typography className={classes.header}>{title}</Typography>
  );

  return (
    <Box
      width='400'
      {...rest}
      display='flex'
      alignItems='flex-start'
      justifyContent='space-between'
    >
      <Box
        display='flex'
        borderBottom='1px solid #E8F2FE'
        alignItems='baseline'
        width='100%'
        margin='0px 16px 0px 16px'
      >
        <Box>{renderIcons()}</Box>
        <Box width='290px' padding='16px 0px 16px 0px'>
          {renderTitle}
          {status === 'FAILURE' && (
            <Box mt={1.5} display='flex'>
              <CommonButton
                text='Retry'
                onClick={onRetryClick}
                variant='tertiary'
              />
            </Box>
          )}
          {taskName === 'async_generate_similar_images' &&
            status === 'SUCCESS' && (
              <Box mt={1.5} display='flex'>
                <CommonButton
                  text='Download'
                  onClick={downloadHandler}
                  variant='tertiary'
                  icon={<FontAwesomeIcon icon={faArrowToBottom} />}
                />
              </Box>
            )}
        </Box>
      </Box>
      <Box>
        <Typography className={classes.timestamp}>{timestamp}</Typography>
      </Box>
    </Box>
  );
};

export default TaskCard;
