import { useSelector } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import clsx from 'clsx';

import Box from '@material-ui/core/Box';
import { makeStyles } from '@material-ui/core/styles';

import TrainingHeader from '../header';
import Footer from '../footer';
import DialogContainer from '../dialog';
import CommonBackdrop from 'app/components/CommonBackdrop';

import {
  selectIsTrainingDialogOpen,
  selectTrainingActiveStep
} from 'store/modelTraining/selector';

const useStyle = makeStyles(theme => ({
  root: {
    '& .MuiPaper-root': {
      backgroundColor: '#F1FBFF',
      maxWidth: '1300px',
      overflowX: 'hidden',
      flexWrap: 'wrap',
      padding: 0
    },
    '& .MuiStepConnector-root': {
      display: 'none'
    },
    '& .MuiStep-horizontal': {
      padding: 0,
      margin: '8px',
      '& .MuiStepLabel-iconContainer': {
        padding: 0
      }
    },
    height: '100%',
    display: 'flex',
    flexDirection: 'column'
  },
  container: {
    height: '100%',
    overflowY: 'hidden'
  },
  footer: {
    height: '65px',
    // boxShadow: '-14px 3px 20px rgba(0, 0, 0, 0.1)',
    background: '#FFFFFF',
    borderTop: `1px solid ${theme.colors.grey[3]}`
  },
  input: {
    fontSize: '0.75rem !important',
    color: '##313131',
    border: 'none',
    borderBottom: '1px solid #E8EDF1',
    width: '400px'
  },
  stepper: {
    backgroundColor: theme.colors.grey[1],
    padding: theme.spacing(3.25, 0, 3.25, 0)
  },
  contentContainer: {
    overflowY: 'auto',
    height: props => `calc(100vh - 115px + ${props.isNoFooter ? 60 : 0}px)`,
    background: theme.colors.grey[1],
    padding: theme.spacing(2)
  }
}));

const mapTrainingState = createStructuredSelector({
  activeStep: selectTrainingActiveStep,
  isDialogOpen: selectIsTrainingDialogOpen
});

const ModelTrainingLayout = ({
  title,
  isBtnDisabled,
  children,
  isLoading,
  onClick,
  btnText,
  onBackBtnClick,
  backBtnText,
  className,
  isNoFooter = false
}) => {
  const classes = useStyle({ isNoFooter });

  const { isDialogOpen } = useSelector(mapTrainingState);

  return (
    <Box className={classes.root}>
      <Box className={classes.container}>
        <TrainingHeader title={title} />

        <Box className={clsx(classes.contentContainer, className)}>
          {children}
        </Box>

        {!isNoFooter && (
          <Footer
            disabled={isBtnDisabled}
            btnText={btnText}
            onClick={onClick}
            backBtnText={backBtnText}
            onBackBtnClick={onBackBtnClick}
          />
        )}
      </Box>

      <CommonBackdrop open={isLoading} />

      {isDialogOpen && <DialogContainer />}
    </Box>
  );
};

export default ModelTrainingLayout;
