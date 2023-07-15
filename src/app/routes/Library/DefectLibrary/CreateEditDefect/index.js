/* eslint-disable camelcase */
import Box from '@material-ui/core/Box';
import CircularProgress from '@material-ui/core/CircularProgress';
import Drawer from '@material-ui/core/Drawer';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Stepper from '@material-ui/core/Stepper';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import api from 'app/api';
import { getUseCases } from 'app/api/Usecase';
import CommonButton from 'app/components/CommonButton';
import CommonDialog from 'app/components/CommonDialog';
import StepCard from 'app/components/StepCard';
import useApi from 'app/hooks/useApi';
import DefectLibDircetUpload from 'app/services/defectLibDirectUpload';
import DefectLibUpload from 'app/services/defectLibUpload';
import { validateFiles } from 'app/utils/helpers';
import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useQueryClient } from 'react-query';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { createStructuredSelector } from 'reselect';
import {
  selectDefectLibActiveStep,
  selectDefectLibDrawerOpen,
  selectDefectLibGlobalMode,
  selectDefectLibMode,
  selectDefectLibNewDefect
} from 'store/defectLibrary/selectors';
import SaveButton from './SaveButton';

import FillDetails from './Step1/FillDetails';
import Step2 from './Step2';
import Step3 from './Step3';

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

const steps = [
  ['Create defect', 'Fill the following details'],
  ['Add Variations', 'Select the Image Records below']
];

const mapDefectToState = createStructuredSelector({
  drawerOpen: selectDefectLibDrawerOpen,
  activeStep: selectDefectLibActiveStep,
  mode: selectDefectLibMode,
  defect: selectDefectLibNewDefect,
  globalMode: selectDefectLibGlobalMode
});

const CreateDefect = ({ dispatch }) => {
  const { drawerOpen, activeStep, mode, defect, globalMode } =
    useSelector(mapDefectToState);
  const classes = useStyle();

  const inputFilesRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [filesChanged, setFilesChanged] = useState(false);
  const [addEntry, setAddEntry] = useState(false);
  const [nextClicked, setNextClicked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [removedFiles, setRemovedFiles] = useState([]);
  const [step2Dirty, setStep2Dirty] = useState(false);

  const { subscriptionId } = useParams();
  const { data: useCases } = useApi(getUseCases, {
    subscription_id: subscriptionId,
    get_all_records: true,
    allowedKeys: []
  });

  const { control, getValues, formState, setValue, reset } = useForm({
    defaultValues: {
      organization_defect_code: defect?.organization_defect_code || '',
      name: defect?.name || '',
      description: defect?.description || '',
      useCases: defect?.use_cases || []
    }
  });

  const { isDirty } = formState;

  const handleClose = () => {
    reset();
    dispatch({ type: 'SET_DRAWER', status: false });
    dispatch({ type: 'RESET' });
    setAddEntry(false);
    handleSetActiveStep(0);
    setOpen(false);
  };

  const handleSetActiveStep = (step, mode = '') => {
    setNextClicked(false);
    setLoading(false);
    dispatch({ type: 'SET_DEFECT_LIB_ACTIVE_STEP', step, mode });
  };

  const handleStepperEdit = step => {
    dispatch({ type: 'SET_MODE', mode: '' });
    setFilesChanged(false);
    handleSetActiveStep(step, 'edit');
  };

  const handleModalOk = () => {
    setOpen(false);
    handleSetActiveStep(0);
    handleClose();
  };

  const handleDiscard = () => {
    setDialogOpen(false);
  };

  const handleContinue = () => {
    // setSelected('')
    // setFiles([])
    // setEdit(false)
    setDialogOpen(false);
    handleClose();
    // setAddEntry(false)
    // setIndex('')
    // setLoading(false)
  };

  const uploadService = useRef(null);
  const queryClient = useQueryClient();

  useEffect(() => {
    uploadService.current =
      process.env.REACT_APP_UPLOAD_TYPE === 's3'
        ? new DefectLibUpload(dispatch, subscriptionId, setLoading)
        : new DefectLibDircetUpload(dispatch, subscriptionId, setLoading);
  }, [subscriptionId]);

  useEffect(() => {
    if (defect) {
      const { uppy } = uploadService.current;
      uploadService.current.defect = defect.id;
      uploadService.current.step1Ids = [];
      if (defect.reference_files?.length) {
        defect.reference_files.forEach(file => {
          uppy.addFile({
            name: `${file.id}-${file.name}`,
            data: file,
            preview: file.url,
            source: 'remote',
            isRemote: true,
            meta: {
              fileSetId: file.id
            },
            size: 1000
          });
        });
        uppy.getFiles().forEach(file => {
          uppy.setFileState(file.id, {
            progress: {
              uploadComplete: true,
              uploadStarted: Date.now(),
              precentage: 100,
              bytesTotal: 1000,
              bytesUploaded: 1000
            }
          });
        });
      }
    }
  }, []);

  async function handleFilesUpload(e) {
    const { uppy, uploadFiles, reset } = uploadService.current;
    reset();
    const { validFiles } = validateFiles(Array.from(e.target.files));
    if (!validFiles.length) {
      return;
    }
    validFiles.forEach(file => {
      uppy.addFile({
        name: file.name,
        data: file,
        preview: URL.createObjectURL(file)
      });
    });
    await uploadFiles();
    setFilesChanged(true);

    // getSesionId(folderName)
    // dispatch(clearSession())
    // setActiveStep((prev) => prev + 1)
  }

  const handleNextClick = () => {
    if (loading) {
      uploadService.current.handleNext = handleNext;
      uploadService.current.nextClicked = true;
      setNextClicked(true);
    } else {
      handleNext();
    }
  };

  const handleNext = () => {
    const { uppy } = uploadService.current;
    if (activeStep === 1) {
      setOpen(true);
    } else if (activeStep === 0) {
      const formData = getValues();
      if (mode === 'create' && isDirty) {
        const data = {};
        data.name = formData.name;
        data.description = formData.description;
        data.organization_defect_code = formData.organization_defect_code;
        data.use_cases = formData.useCases.map(usecae => usecae.id);
        data.subscription = subscriptionId;
        const files = uppy.getFiles();
        const ids = files.map(file => file.meta.fileSetId);
        data.reference_file_ids = ids;
        setLoading(true);
        api
          .createEditDefect(data)
          .then(_ => {
            queryClient.invalidateQueries('defects');
            queryClient.invalidateQueries('bulkLableUseCaseDefects');
            uploadService.current.defect = _.data.id;
            dispatch({ type: 'UPDATE_DEFECT', defect: _.data });
            handleSetActiveStep(activeStep + 1);
          })
          .catch(err => {
            if (err.response) {
              if (err.response.status === 400) {
                const { name } = err.response.data;
                toast.error(name?.[0]);
              }
            }
          })
          .finally(() => setLoading(false));
      } else if (isDirty || filesChanged || removedFiles.length) {
        const { dirtyFields } = formState;
        const useCases = getValues('useCases');
        const data = { ...formData };
        Object.entries(dirtyFields).forEach(([key, value]) => {
          if (value) {
            data[key] = getValues(key);
          }
        });
        if (uploadService.current.step1Ids.length || removedFiles.length) {
          const files = uppy.getFiles();
          const ids = files.map(file => file.meta.fileSetId);
          data.reference_file_ids = ids;
        }
        setLoading(true);
        data.use_cases = useCases.map(useCase => useCase.id);
        delete data.useCases;
        api
          .updateDefect(data, defect.id)
          .then(_ => {
            queryClient.invalidateQueries('defects');
            queryClient.invalidateQueries('bulkLableUseCaseDefects');
            dispatch({ type: 'UPDATE_DEFECT', defect: _.data });
            handleSetActiveStep(activeStep + 1);
          })
          .catch(err => {
            if (err.response) {
              if (err.response.status === 400) {
                const { name } = err.response.data;
                toast.error(name?.[0]);
              }
            }
          })
          .finally(() => setLoading(false));
      } else {
        handleSetActiveStep(activeStep + 1);
      }
    } else {
      handleSetActiveStep(activeStep + 1);
    }
  };

  const handleFileDelete = () => {
    setRemovedFiles(prevState => [...prevState, new Date()]);
  };

  const showFileDialogue = () => {
    inputFilesRef.current.click();
  };

  function getStepContent(step) {
    switch (step) {
      case 0:
        return (
          <FillDetails
            control={control}
            hanldeFileInputCLick={showFileDialogue}
            setValue={setValue}
            open={dialogOpen}
            setOpen={setDialogOpen}
            handleFileDelete={handleFileDelete}
            uploadService={uploadService}
            useCases={useCases?.results || []}
          />
        );
      case 1:
        return (
          <Step2
            loading={loading}
            setLoading={setLoading}
            uploadService={uploadService}
            dispatchGlobal={dispatch}
            addEntry={addEntry}
            setAddEntry={setAddEntry}
            setStep2Dirty={setStep2Dirty}
            step2Dirty={step2Dirty}
          />
        );
      case 2:
        return <Step3 uploadService={uploadService} />;
      default:
        return 'Unknown step';
    }
  }

  return (
    <Drawer className={classes.root} anchor='right' open={drawerOpen}>
      <Box p={1} className={classes.container}>
        <Box my={4} mx={2}>
          <Typography variant='h1' gutterBottom>
            Create / Edit Defect
          </Typography>
          <Typography variant='h4'>
            Follow the below steps to create/edit defect
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
        {activeStep === steps.length ? null : (
          <Box mx={2}>{getStepContent(activeStep)}</Box>
        )}
      </Box>
      <Box
        className={classes.footer}
        display='flex'
        justifyContent='flex-end'
        alignItems='center'
      >
        {activeStep !== 1 && (
          <Box mr={2}>
            <CommonButton
              text='Close'
              variant='tertiary'
              onClick={
                (activeStep === 0 &&
                  (isDirty || removedFiles.length || filesChanged)) ||
                step2Dirty
                  ? () => setDialogOpen(true)
                  : handleClose
              }
            />
          </Box>
        )}

        <SaveButton
          activeStep={activeStep}
          control={control}
          onClick={handleNextClick}
          addEntry={addEntry}
          text={
            activeStep === 1 ? (
              'Done'
            ) : loading && nextClicked ? (
              <CircularProgress size={15} />
            ) : (
              'Save'
            )
          }
        />
      </Box>
      <CommonDialog
        message={`Defect ${
          globalMode === 'create' ? 'created' : 'edited'
        } successfully`}
        open={open}
        handleClose={handleClose}
        actions={[
          {
            text: 'Ok',
            callback: handleModalOk
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
      <input
        type='file'
        style={{ display: 'none' }}
        multiple
        ref={inputFilesRef}
        onChange={handleFilesUpload}
      />
    </Drawer>
  );
};

export default CreateDefect;
