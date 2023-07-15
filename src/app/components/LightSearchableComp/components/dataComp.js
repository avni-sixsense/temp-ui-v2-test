import { faPencil, faTrashAlt } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Box from '@material-ui/core/Box';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import CommonButton from 'app/components/ReviewButton';
import React from 'react';

const useStyles = makeStyles(theme => ({
  title: {
    fontSize: '0.875rem',
    fontWeight: 600,
    color: theme.colors.grey[18]
  },
  subTitle: {
    fontSize: '0.8125rem',
    fontWeight: 400,
    color: theme.colors.grey[10]
  },
  tag: {
    backgroundColor: theme.colors.grey[3],
    borderRadius: '4px'
  }
}));

const DataComp = ({ title, tag, onEdit, onDelete, subTitle = '' }) => {
  const classes = useStyles();
  return (
    <Box>
      <Box
        mb={0.75}
        display='flex'
        alignItems='center'
        justifyContent='space-between'
      >
        <Box>
          <Typography className={classes.title}>{title}</Typography>
        </Box>
        <Box display='flex' alignItems='center' justifyContent='space-between'>
          <Box px={0.5} pb={0.125} mr={1} className={classes.tag}>
            {tag}
          </Box>
          <Box mr={1}>
            <CommonButton
              text='Edit'
              icon={<FontAwesomeIcon icon={faPencil} />}
              variant='tertiary'
              size='sm'
              onClick={() => onEdit({ title, subTitle })}
            />
          </Box>
          <CommonButton
            icon={<FontAwesomeIcon icon={faTrashAlt} />}
            variant='tertiary'
            size='sm'
          />
        </Box>
      </Box>
      {subTitle && (
        <Box>
          <Typography className={classes.subTitle}>{subTitle}</Typography>
        </Box>
      )}
    </Box>
  );
};

export default DataComp;
