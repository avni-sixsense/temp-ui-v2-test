import { faArrowAltFromTop, faBell } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Box from '@material-ui/core/Box';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import CommonButton from 'app/components/ReviewButton';
import React from 'react';
import { Draggable } from 'react-beautiful-dnd';

const useStyles = makeStyles(theme => ({
  title: {
    fontSize: '1rem',
    fontWeight: 600,
    color: theme.colors.grey[18]
  },
  root: {
    borderRadius: '8px',
    border: `0.2px solid ${theme.colors.grey[6]}`,
    backgroundColor: theme.colors.grey[0],
    boxShadow: theme.colors.shadow.base
  },
  value: {
    fontSize: '2.5rem',
    fontWeight: 700,
    color: theme.colors.grey[18]
  },
  subTitle: {
    fontSize: '0.8125rem',
    fontWeight: 400,
    color: theme.colors.grey[10]
  },
  btns: {
    marginLeft: theme.spacing(1)
  },
  titleContainer: {
    borderBottom: `1px solid ${theme.colors.grey[3]}`
  }
}));

const DataCard = ({
  title = '',
  value = '',
  subTitle = '',
  wrapperClass = '',
  index,
  id
}) => {
  const classes = useStyles();

  return (
    <Draggable draggableId={String(id)} index={index}>
      {provided => (
        <Box
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
          // width="46%"
          mx={1.25}
          className={`${classes.root} ${wrapperClass}`}
        >
          <Box
            className={classes.titleContainer}
            py={1.1875}
            pl={1.75}
            mb={1.5}
            pr={1.25}
            display='flex'
            alignItems='center'
            justifyContent='space-between'
          >
            <Box>
              <Typography className={classes.title}>{title}</Typography>
            </Box>
            <Box>
              <CommonButton
                icon={<FontAwesomeIcon icon={faBell} />}
                size='sm'
                variant='tertiary'
                wrapperClass={classes.btns}
              />
              <CommonButton
                icon={<FontAwesomeIcon icon={faArrowAltFromTop} />}
                size='sm'
                variant='tertiary'
                wrapperClass={classes.btns}
              />
            </Box>
          </Box>
          <Box pl={1.5} pr={1.25}>
            <Box mb={0.5}>
              <Typography className={classes.value}>{value}</Typography>
            </Box>
            <Box pb={1.5}>
              <Typography className={classes.subTitle}>{subTitle}</Typography>
            </Box>
          </Box>
        </Box>
      )}
    </Draggable>
  );
};

export default DataCard;
