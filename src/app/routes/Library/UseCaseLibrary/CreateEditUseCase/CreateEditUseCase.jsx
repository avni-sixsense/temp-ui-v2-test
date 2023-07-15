/* eslint-disable camelcase */
import Box from '@material-ui/core/Box';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Stepper from '@material-ui/core/Stepper';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import { createUseCase, updateUseCase } from 'app/api/Usecase';
import CommonButton from 'app/components/CommonButton';
import CommonDialog from 'app/components/CommonDialog';
import StepCard from 'app/components/StepCard';
import { COMMONS } from 'app/constants/common';
import { useCallback } from 'react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useQueryClient } from 'react-query';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { addToUseCaseList, updateUseCaseList } from 'store/useCase/actions';
import SaveButton from './components/SaveButton';

import FillDetails from './Step1/FillDetails';

const useStyle = makeStyles(theme => ({
  root: {
    '& > .MuiPaper-root': {
      backgroundColor: '#F1FBFF',
      width: '90%'
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
    }
  },
  container: {
    height: '92vh',
    overflowY: 'auto'
  },
  stepper: {
    backgroundColor: '#F1FBFF',
    overflowX: 'hidden',
    flexWrap: 'wrap',
    padding: '8px'
  },
  footer: {
    position: 'fixed',
    bottom: '0px',
    height: '8vh',
    padding: theme.spacing(2, 0),
    boxShadow: '-14px 3px 20px rgba(0, 0, 0, 0.1)',
    background: '#FFFFFF',
    width: '90%'
  },
  input: {
    fontSize: '0.75rem !important',
    color: '##313131',
    border: 'none',
    borderBottom: '1px solid #E8EDF1',
    width: '400px'
  }
}));

const CreateUseCase = () => {
  const activeStep = useSelector(
    ({ useCaseLibrary }) => useCaseLibrary.activeStep
  );
  const usecase = useSelector(({ useCaseLibrary }) => useCaseLibrary.usecase);
  const globalMode = useSelector(
    ({ useCaseLibrary }) => useCaseLibrary.globalMode
  );
  const mode = useSelector(({ useCaseLibrary }) => useCaseLibrary.mode);

  const dispatch = useDispatch();
  const steps = [
    [
      `${mode === 'update' ? 'Edit' : 'Create'}  Use Case`,
      'Fill the following details'
    ]
  ];

  const classes = useStyle();
  const { subscriptionId } = useParams();

  const queryClient = useQueryClient();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  const { control, getValues, formState, setValue, reset } = useForm({
    defaultValues: {
      // name: undefined,
      // defects: undefined,
      type: COMMONS.useCaseTypes[0]
    }
  });

  useEffect(() => {
    if (mode === 'update' && Object.keys(usecase).length) {
      const { name, defects, type } = usecase;
      setValue('name', name);
      if (type === 'CLASSIFICATION_SINGLE_LABEL') {
        setValue('type', COMMONS.useCaseTypes[0]);
      } else if (type === 'CLASSIFICATION_MULTI_LABEL') {
        setValue('type', COMMONS.useCaseTypes[1]);
      } else {
        setValue('type', { name: type, id: type });
      }

      setValue('defects', defects);
    }
  }, [mode, usecase]);

  const { isDirty } = formState;

  const handleClose = () => {
    reset();
    dispatch({ type: 'USECASE_SET_DRAWER', status: false });
    dispatch({ type: 'USECASE_RESET' });
    handleSetActiveStep(0);
    setOpen(false);
  };

  const handleSetActiveStep = (step, mode = '') => {
    setLoading(false);
    dispatch({ type: 'USECASE_SET_ACTIVE_STEP', step, mode });
  };

  const handleStepperEdit = step => {
    dispatch({ type: 'USECASE_SET_MODE', mode: '' });
    handleSetActiveStep(step, 'edit');
  };

  const handleUsecaseOk = () => {
    setOpen(false);
    handleSetActiveStep(0);
    handleClose();
  };

  const handleDiscard = () => {
    setDialogOpen(false);
  };

  const handleContinue = () => {
    setDialogOpen(false);
    handleClose();
  };

  const handleNext = useCallback(() => {
    if (activeStep === 0) {
      const formData = getValues();
      if (mode === 'create' && isDirty) {
        const data = {};
        data.name = formData.name;
        if ((formData.type?.name || '').includes('LABEL')) {
          const [type, classificationType] = (formData.type?.id || '').split(
            ','
          );
          data.type = type;
          data.classification_type = classificationType;
        } else {
          data.type = formData.type?.name;
        }
        data.defects = formData.defects?.map(defect => defect.id);
        data.subscription = subscriptionId;
        createUseCase({ data })
          .then(res => {
            dispatch(addToUseCaseList(res));
            queryClient.invalidateQueries('bulkLableUseCaseDefects');
            setOpen(true);
          })
          .catch(err => {
            if (err.response) {
              if (err.response.status === 400) {
                const { name } = err.response.data;
                toast.error(name?.[0]);
              }
            }
          });
      } else if (mode === 'update' && isDirty) {
        const { dirtyFields } = formState;
        const data = {};

        Object.entries(dirtyFields).forEach(([key, value]) => {
          if (value) {
            data[key] = getValues(key);
          }
        });
        const defects = getValues('defects');
        data.defects = defects?.map(defect => defect.id);
        setLoading(true);
        updateUseCase({ data, id: usecase.id })
          .then(res => {
            dispatch(updateUseCaseList(res));
            queryClient.invalidateQueries('bulkLableUseCaseDefects');
            setOpen(true);
          })
          .catch(err => {
            if (err.response) {
              if (err.response.status === 400) {
                const { name } = err.response.data;
                toast.error(name?.[0], {
                  toastId: 'useCaseUnique'
                });
              }
            }
          })
          .finally(() => setLoading(false));
      } else {
        handleSetActiveStep(activeStep + 1);
        setOpen(true);
      }
    } else {
      handleSetActiveStep(activeStep + 1);
    }
  }, [activeStep, formState, isDirty, mode, usecase.id, formState.dirtyFields]);

  const getStepContent = useCallback(
    step => {
      switch (step) {
        case 0:
          return <FillDetails control={control} />;
        default:
          return 'Unknown step';
      }
    },
    [control]
  );

  return (
    <>
      <Box p={1} className={classes.container}>
        <Box my={4} mx={2}>
          <Typography variant='h1' gutterBottom>
            Create / Edit Use Case
          </Typography>
          <Typography variant='h4'>
            Follow the below steps to create/edit use case
          </Typography>
        </Box>
        <Stepper
          className={classes.stepper}
          orientation='horizontal'
          activeStep={activeStep}
          elevation={0}
        >
          {steps.map((label, index) => (
            <Step key={label}>
              <StepLabel
                StepIconComponent={() => (
                  <StepCard
                    index={index}
                    label={label}
                    activeStep={activeStep}
                    handleStepperEdit={handleStepperEdit}
                  />
                )}
              />
            </Step>
          ))}
        </Stepper>
        <div>
          {activeStep === steps.length ? null : (
            <div>
              <Box mx={2}>{getStepContent(activeStep)}</Box>
            </div>
          )}
        </div>
      </Box>
      <Box
        className={classes.footer}
        display='flex'
        justifyContent='flex-end'
        alignItems='center'
      >
        <Box mr={2}>
          <CommonButton
            text='Close'
            variant='tertiary'
            onClick={isDirty ? () => setDialogOpen(true) : handleClose}
          />
        </Box>

        <SaveButton
          handleNext={handleNext}
          loading={loading}
          control={control}
        />
      </Box>
      <CommonDialog
        message={`Use Case ${
          globalMode === 'create' ? 'created' : 'edited'
        } successfully`}
        open={open}
        handleClose={handleClose}
        actions={[
          {
            text: 'Ok',
            callback: handleUsecaseOk
          }
        ]}
      />
      <CommonDialog
        message='Are you sure you want to discard the changes?'
        open={dialogOpen}
        actions={[
          {
            text: 'Discard',
            callback: handleContinue,
            variant: 'tertiary'
          },
          {
            text: 'Continue',
            callback: handleDiscard
          }
        ]}
      />
    </>
  );
};

export default CreateUseCase;
