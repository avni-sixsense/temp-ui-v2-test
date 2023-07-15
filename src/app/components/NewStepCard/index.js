import Box from '@material-ui/core/Box';
import Card from '@material-ui/core/Card';
import Divider from '@material-ui/core/Divider';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import React from 'react';

const useStyles = makeStyles(theme => ({
  stepIndicator: {
    borderRadius: '50%',
    backgroundColor: 'rgba(2, 101, 140, 0.1)'
  },
  stepIndicatorCompleted: {
    borderRadius: '50%',
    backgroundColor: 'transparent !important'
  },
  stepperCard: {
    backgroundColor: 'transparent !important',
    padding: '5% !important',
    // boxShadow: '-1px 9px 20px rgba(0, 0, 0, 0.06)',
    // borderTop: '2px solid #4DC0E0',
    width: '300px !important',
    height: '83px',
    flexWrap: 'nowrap !important',
    display: 'flex'
  },
  stepperCardCompleted: {
    backgroundColor: 'transparent !important',
    // border: '0.5px solid #00BB40',
    padding: '5% !important',
    width: '300px !important',
    height: '83px',
    flexWrap: 'nowrap !important',
    '&  [class*="stepIndicator"]': {
      background: '#ffffff !important'
    }
  },
  stepperCardPending: {
    backgroundColor: 'transparent !important',
    // border: '0.3px solid #02435D',
    padding: '5% !important',
    width: '300px !important',
    display: 'flex',
    height: '83px',
    flexWrap: 'nowrap !important'
    // opacity: 0.5,
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
  },
  completedText: {
    color: theme.colors.blue[600]
  },
  pendingText: {
    color: theme.colors.grey[9]
  },
  divider: {
    height: '4px',
    width: '100%',
    borderRadius: '1000px'
  },
  label: {
    fontWeight: 600,
    fontSize: '0.875rem',
    color: theme.colors.grey[900]
  },
  complete: {
    backgroundColor: theme.colors.blue[600]
  },
  pending: {
    backgroundColor: theme.colors.grey[5]
  },
  active: {
    backgroundColor: theme.colors.grey[7]
  }
}));

const StepCard = ({
  handleStepperEdit,
  activeStep,
  index,
  label = [],
  disabledSteps = []
}) => {
  const classes = useStyles();
  const completed = index < activeStep;

  return (
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
      <Box width='100%' display='flex' flexDirection='column'>
        <Box display='flex' justifyContent='flex-start' alignItems='center'>
          <Typography
            className={
              activeStep < index ? classes.pendingText : classes.completedText
            }
          >
            Step {index + 1}
          </Typography>
        </Box>
        <Box mb={1}>
          <Typography className={classes.label}>{label[0]}</Typography>
        </Box>
        <Divider
          className={`${classes.divider} ${
            completed
              ? classes.complete
              : activeStep < index
              ? classes.pending
              : classes.active
          }`}
        />
      </Box>
    </Card>
  );
};

export default StepCard;
