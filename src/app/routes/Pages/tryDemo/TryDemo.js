import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Step from '@material-ui/core/Step';
import StepContent from '@material-ui/core/StepContent';
import StepLabel from '@material-ui/core/StepLabel';
import Stepper from '@material-ui/core/Stepper';
import { makeStyles } from '@material-ui/core/styles';
import { alpha } from '@material-ui/core/styles/colorManipulator';
import Typography from '@material-ui/core/Typography';
import React from 'react';

const useStyles = makeStyles(theme => ({
  paper: {
    width: '630px',
    display: 'flex',
    flexDirection: 'column',
    padding: 0,
    borderRadius: '10px',
    border: `1px solid ${alpha(theme.colors.marineBlue, 0.13)}`,
    boxShadow: `0 10px 20px 5px ${alpha(theme.colors.azure, 0.1)}`,
    marginTop: theme.spacing(5),
    marginBottom: theme.spacing(2),
    marginLeft: 'auto',
    marginRight: 'auto',
    height: '468px'
  },
  title: {
    ...theme.typeFace.futura125,
    fontWeight: 500,
    lineHeight: '2rem',
    textAlign: 'center',
    marginTop: theme.spacing(3)
  },
  subTitle: {
    ...theme.typeFace.futuraBT1,
    lineHeight: '1.5rem',
    textAlign: 'center',
    opacity: 0.8,
    marginTop: theme.spacing(0.5),
    marginBottom: theme.spacing(5)
  },
  actionsContainer: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2)
  },
  data: {
    ...theme.typeFace.futuraBT875,
    fontWeight: '500',
    opacity: '0.7',
    lineHeight: '1.43'
  },
  heading: {
    ...theme.typeFace.link,
    ...theme.typeFace.futura1,
    fontWeight: '500'
  },
  stepper: {
    '& .MuiStepContent-root': {
      marginLeft: '10px'
    },
    '& .MuiStepper-vertical': {
      padding: 0
    },
    '& .MuiStepIcon-root.MuiStepIcon-completed': {
      color: theme.colors.shamrock,
      width: '20px',
      height: '20px'
    },
    '& .MuiStepConnector-vertical': {
      marginLeft: '10px'
    },
    height: ' 210px',
    marginLeft: theme.spacing(11.5),
    marginRight: theme.spacing(11.5),
    marginBottom: theme.spacing(7.5)
  }
}));

const useStepLabelIconStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '20px',
    height: '20px',
    objectFit: 'contain',
    boxShadow: `0 4px 10px 5px ${alpha(theme.colors.azure, 0.08)}`,
    borderRadius: '10px',
    '& div': {
      width: '8px',
      height: '8px',
      borderRadius: '4px'
    }
  },
  inactive: {
    border: `solid 1px ${theme.colors.marineBlue}`,
    backgroundColor: theme.colors.white,
    '& div': {
      backgroundColor: theme.colors.marineBlue
    }
  },
  active: {
    backgroundImage: `linear-gradient(146deg, ${theme.colors.azure} 5%,${theme.colors.seafoamBlue}  149%)`,
    '& div': {
      backgroundColor: theme.colors.white
    }
  },
  completed: {
    backgroundColor: theme.colors.shamrock,
    '& div': {
      display: ' inline-block',
      transform: 'rotate(45deg)',
      height: '10px',
      width: '4px',
      marginTop: '-3px',
      marginLeft: ' 2px',
      borderBottom: `1px solid ${theme.colors.white}`,
      borderRight: `1px solid ${theme.colors.white}`,
      borderRadius: 0
    }
  }
}));

function StepLabelIcon(props) {
  const classes = useStepLabelIconStyles();
  const className = props.completed
    ? classes.completed
    : props.active
    ? classes.active
    : classes.inactive;
  return (
    <div className={`${classes.root} ${className}`}>
      <div />
    </div>
  );
}
function getSteps() {
  return ['Sample Data', 'Instruction'];
}

function getStepContent(step) {
  switch (step) {
    case 0:
      return `Lorem ipsum dolor sit amet, con sectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.`;
    case 1:
      return 'Last stepper';
    default:
      return 'Unknown step';
  }
}

export default function TryDemo() {
  const classes = useStyles();
  const [activeStep, setActiveStep] = React.useState(0);
  const [btnDisable, setBtnDisable] = React.useState(true);
  const steps = getSteps();

  const handleDisable = () => {
    setActiveStep(prevActiveStep => prevActiveStep + 1);
    setBtnDisable(!btnDisable);
  };

  const handleNext = () => {
    setActiveStep(prevActiveStep => prevActiveStep + 1);
  };

  const handleReset = () => {
    setBtnDisable(!btnDisable);
    setActiveStep(0);
  };

  return (
    <>
      <Paper elevation={3} className={classes.paper}>
        <Typography variant='h1' className={classes.title}>
          Try Demo
        </Typography>
        <Typography variant='h1' className={classes.subTitle}>
          Before proceeding to the demo, please download the following
        </Typography>
        <div className={classes.stepper}>
          <Stepper activeStep={activeStep} orientation='vertical'>
            {steps.map((label, index) => (
              <Step key={label}>
                <StepLabel StepIconComponent={StepLabelIcon}>
                  <Typography className={classes.heading}>{label}</Typography>
                </StepLabel>
                <StepContent>
                  <Typography className={classes.data}>
                    {getStepContent(index)}
                  </Typography>
                  <div className={classes.actionsContainer}>
                    <div>
                      <Button
                        name='btn'
                        variant='outlined'
                        onClick={
                          activeStep === steps.length - 1
                            ? handleDisable
                            : handleNext
                        }
                        className={classes.button}
                      >
                        {activeStep === steps.length - 1
                          ? 'Finish'
                          : 'Download Sample Data'}
                      </Button>
                    </div>
                  </div>
                </StepContent>
              </Step>
            ))}
          </Stepper>
        </div>
        <Grid container justifyContent='center'>
          <Grid item>
            <Button
              name='tryDemoBtn'
              disabled={btnDisable}
              onClick={handleReset}
            >
              Try Demo
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </>
  );
}
