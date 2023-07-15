import Box from '@material-ui/core/Box';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import api from 'app/api';
import Progress from 'app/components/Progress';
import SideDrawer from 'app/components/SideDrawer';
import SideDrawerBody from 'app/components/SideDrawerBody';
import SideDrawerBodyForms from 'app/components/SideDrawerBody/SideDrawerBodyForms';
import UploadModelService from 'app/services/uploadModelService';
import uploadImg from 'assests/images/fileupload/upload/upload.png';
import UploadCloud from 'assests/images/fileupload/upload/uploadCloud.svg';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react';
import { useQuery, useQueryClient } from 'react-query';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { getModels } from 'store/common/actions';
import { toast } from 'react-toastify';
import { debounce } from 'app/utils';
import { getUseCases } from 'app/api/Usecase';
import useApi from 'app/hooks/useApi';

const useStyle = makeStyles(theme => ({
  container1: {
    height: '100%',
    padding: theme.spacing(5),
    flexWrap: 'nowrap',

    '&[disabled]': {
      pointerEvents: 'none',
      opacity: 0.7,
      cursor: 'not-allowed'
    }
  },
  uploadContainer: {
    padding: theme.spacing(2.25),
    '& .MuiCardContent-root': {
      padding: 0,
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center'
    }
  },
  imageWrapper: {
    background: '#F1FBFF',
    textAlign: 'center',
    borderRadius: '3px'
  }
}));

// const types = [
// 	{
// 		name: 'CLASSIFICATION',
// 		id: 'CLASSIFICATION',
// 	},
// 	{
// 		name: 'CLASSIFICATION_AND_DETECTION',
// 		id: 'CLASSIFICATION_AND_DETECTION',
// 	},
// 	{
// 		name: 'DETECTION',
// 		id: 'DETECTION',
// 	},
// ]

const UploadModel = () => {
  const classes = useStyle();

  const dispatch = useDispatch();

  const state = useSelector(({ modelLibrary }) => modelLibrary);
  const { uploadModelDrawer } = state;

  const [modelName, setModelName] = useState('');
  const [value, setValue] = useState([]);
  const [currentUseCase, setCurrentUseCase] = useState(null);
  const [isModelNameExists, setIsModelNameExists] = useState(true);
  const [isFilesLoading, setIsFilesLoading] = useState(false);

  const { subscriptionId } = useParams();

  const uploadService = useRef();
  const modelNameRef = useRef();
  const inputFolderRef = useRef();

  const queryClient = useQueryClient();

  const { data: defects = [] } = useQuery(
    ['defects', subscriptionId],
    context => api.getDefects(...context.queryKey),
    { enabled: !!subscriptionId }
  );

  const { data: useCases, isLoading: isUsecaseLoading } = useApi(getUseCases, {
    subscription_id: subscriptionId,
    get_all_records: true,
    allowedKeys: []
  });

  useEffect(() => {
    uploadService.current = new UploadModelService(dispatch, subscriptionId);
  }, []);

  const checkModalNameExists = () => {
    if (modelNameRef.current.value.length) {
      uploadService.current.checkModelNameExists(
        modelNameRef.current.value,
        (_, exists) => {
          if (exists) {
            setIsModelNameExists(true);
            const errMsg = 'Model name already exists';
            toast.error(errMsg);
            console.error(errMsg);
            modelNameRef.current.focus();
          } else {
            setIsModelNameExists(false);
          }
        }
      );
    }
  };

  const debouncedCheckModelNameExists = useCallback(
    debounce(checkModalNameExists),
    []
  );

  useEffect(() => {
    if (modelNameRef.current) debouncedCheckModelNameExists();
  }, [modelName]);

  const handleInputChange = event => {
    const { value } = event.target;

    if (!value.length && !isModelNameExists) setIsModelNameExists(true);

    setModelName(event.target.value);
  };

  async function handleFolderUpload(e) {
    setIsFilesLoading(true);

    try {
      const { uppy, uploadFiles, directUppy } = uploadService.current;
      const uppyCurrent =
        process.env.REACT_APP_UPLOAD_TYPE === 's3' ? uppy : directUppy;
      // uppyCurrent.reset();
      const tempFiles = Array.from(e.target.files);
      tempFiles.forEach(file => {
        uppyCurrent.addFile({
          name: file.name,
          data: file
        });
      });
      uploadFiles(currentUseCase, value);
    } catch (err) {
      setIsFilesLoading(false);
    }
  }

  const handleClose = () => {
    dispatch(getModels(subscriptionId));
    setModelName('');
    queryClient.invalidateQueries('subscription');
    dispatch({
      type: 'MODEL_LIB_SET_UPLOAD_MODEL_DRAWER_CLICK',
      status: false
    });
  };

  const handleUseCaseSelect = useCase => {
    if (useCase) setCurrentUseCase(useCase);
  };

  const actionBtns = useMemo(
    () => [{ text: 'Close', onClick: handleClose }],
    []
  );

  return (
    <SideDrawer
      id='model_lib_upload_drawer'
      open={uploadModelDrawer}
      headerProps={{ text: 'Upload Model', onClick: handleClose }}
      footerProps={{ actionBtns }}
    >
      <SideDrawerBody>
        <SideDrawerBodyForms
          fields={[
            {
              id: 'model-name',
              label: 'Model Name',
              onChange: handleInputChange,
              placeholder: 'Enter model name',
              value: modelName,
              autoFocus: true,
              inputRef: modelNameRef,
              disabled: !isModelNameExists && isFilesLoading
            },
            {
              id: 'model-use-case',
              type: 'select',
              label: 'Use Case',
              models: useCases?.results ?? [],
              placeholder: 'Select use case',
              value: currentUseCase,
              onChange: handleUseCaseSelect,
              disabled: !isModelNameExists && isFilesLoading,
              isLoading: isUsecaseLoading
            },
            {
              id: 'model-defect',
              type: 'select',
              label: 'Defect',
              models: defects?.results ?? [],
              placeholder: 'Select defect',
              onChange: setValue,
              multiSelect: true,
              disabled: !isModelNameExists && isFilesLoading
            }
          ]}
        />

        <Grid
          container
          direction='column'
          className={classes.container1}
          disabled={
            isFilesLoading ||
            isModelNameExists ||
            !currentUseCase ||
            !value.length
          }
        >
          <Card className={classes.uploadContainer} elevation={0}>
            <CardContent>
              <Box className={classes.imageWrapper} p={2.25} width={76}>
                <img src={uploadImg} alt='' />
              </Box>

              <Box ml={2} flexGrow={1}>
                <Typography variant='h3'>Upload Model Folder</Typography>
              </Box>

              <Box mr={1} textAlign='center' display='flex'>
                <img
                  src={UploadCloud}
                  alt=''
                  onClick={() => inputFolderRef.current?.click()}
                  className='ss_pointer'
                />
              </Box>
            </CardContent>

            <Progress
              uppy={
                process.env.REACT_APP_UPLOAD_TYPE === 's3'
                  ? uploadService?.current?.uppy
                  : uploadService?.current?.directUppy
              }
            />
          </Card>
        </Grid>
      </SideDrawerBody>

      <input
        type='file'
        directory=''
        webkitdirectory=''
        mozdirectory=''
        style={{ display: 'none' }}
        multiple
        ref={inputFolderRef}
        onChange={handleFolderUpload}
      />
    </SideDrawer>
  );
};

export default UploadModel;
