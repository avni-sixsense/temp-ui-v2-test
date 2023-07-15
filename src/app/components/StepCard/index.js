import Badge from '@material-ui/core/Badge';
import Box from '@material-ui/core/Box';
import Card from '@material-ui/core/Card';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import correctIcon from 'assests/images/icons/correctIcon.png';
import PencilIcon from 'assests/images/icons/pencil.svg';
import React from 'react';

const useStyles = makeStyles(() => ({
  stepIndicator: {
    borderRadius: '50%',
    backgroundColor: 'rgba(2, 101, 140, 0.1)'
  },
  stepIndicatorCompleted: {
    borderRadius: '50%',
    backgroundColor: '#FFFFFF !important'
  },
  stepperCard: {
    backgroundColor: '#FFFFFF !important',
    padding: '5% !important',
    boxShadow: '-1px 9px 20px rgba(0, 0, 0, 0.06)',
    borderTop: '2px solid #4DC0E0',
    width: '300px !important',
    height: '83px',
    flexWrap: 'nowrap !important',
    display: 'flex'
  },
  stepperCardCompleted: {
    backgroundColor: 'rgba(0, 187, 64, 0.08) !important',
    border: '0.5px solid #00BB40',
    padding: '5% !important',
    width: '300px !important',
    height: '83px',
    flexWrap: 'nowrap !important',
    '&  [class*="stepIndicator"]': {
      background: '#ffffff !important'
    }
  },
  stepperCardPending: {
    backgroundColor: '#F1FBFF !important',
    border: '0.3px solid #02435D',
    padding: '5% !important',
    width: '300px !important',
    display: 'flex',
    height: '83px',
    flexWrap: 'nowrap !important',
    opacity: 0.5
  },
  stepper: {
    backgroundColor: '#F1FBFF',
    overflowX: 'hidden',
    flexWrap: 'wrap',
    padding: '8px'
  },
  editIcon: {
    position: 'relative',
    left: '30px',
    cursor: 'pointer'
  },
  stepperFooter: {
    width: '100%',
    position: 'fixed',
    bottom: '0',
    backgroundColor: '#FFF',
    padding: '1% 2% 1% 70%'
  }
}));

const StepCard = ({
  handleStepperEdit,
  activeStep,
  index,
  label = [],
  disabledSteps = [],
  disableEdit
}) => {
  const classes = useStyles();
  const completed = index < activeStep;

  const handleEditClick = () => {
    if (!(index in disabledSteps)) {
      handleStepperEdit(index);
    }
  };

  return (
    <Badge
      badgeContent={
        <img
          className={classes.editIcon}
          onClick={handleEditClick}
          src={PencilIcon}
          alt=''
        />
      }
      invisible={!completed || disableEdit}
      overlap='circle'
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right'
      }}
    >
      <Card
        className={
          completed
            ? classes.stepperCardCompleted
            : activeStep < index
            ? classes.stepperCardPending
            : classes.stepperCard
        }
        elevation={0}
      >
        <Box display='flex'>
          <Badge
            badgeContent={<img src={correctIcon} alt='' />}
            invisible={!completed}
            style={{ height: 50 }}
            overlap='circle'
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right'
            }}
          >
            <Box
              className={
                completed
                  ? classes.stepIndicatorCompleted
                  : classes.stepIndicator
              }
              display='flex'
              justifyContent='center'
              alignItems='center'
              width={50}
              height={50}
              flexDirection='column'
            >
              <Typography variant='subtitle2' style={{ fontSize: '10px' }}>
                Step
              </Typography>
              <Box display='flex'>
                <Typography align='center' variant='h3'>
                  {index + 1}
                </Typography>
              </Box>
            </Box>
          </Badge>
          <Box mx={1} my={1}>
            <Typography variant='body2'>{label[0]}</Typography>
            <Typography variant='subtitle2'>{label?.[1] || ''}</Typography>
          </Box>
        </Box>
      </Card>
    </Badge>
  );
};

export default StepCard;
