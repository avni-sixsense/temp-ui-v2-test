import { Paper } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';
import LinearProgress from '@material-ui/core/LinearProgress';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import api from 'app/api';
import { getUseCases } from 'app/api/Usecase';
import CommonButton from 'app/components/CommonButton';
import useApi from 'app/hooks/useApi';
import ModelSelect from 'app/routes/reviewData/components/ModelSelect';
import React, { useEffect, useMemo, useState } from 'react';
import { useQuery } from 'react-query';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

const useStyles = makeStyles(() => ({
  gridContainer: {
    width: '100%',

    '& > div': {
      backgroundColor: 'transparent',

      '&:nth-child(even)': {
        marginBottom: '10px'
      }
    }
  },
  modelBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: '3px'
  },
  modelBoxDrop: {
    backgroundColor: '#FFFFFF',
    border: '1px solid rgba(2, 67, 93, 0.2)',
    borderRadius: '3px'
  },
  iconBtn: {
    padding: '0px',
    margin: '0px'
  }
}));

const BorderLinearProgress = withStyles(theme => ({
  root: {
    height: 5,
    borderRadius: 5,
    margin: '12px 0'
  },
  colorPrimary: {
    backgroundColor:
      theme.palette.grey[theme.palette.type === 'light' ? 200 : 700]
  },
  bar: {
    borderRadius: 5,
    backgroundColor: '#65D7C8'
  }
}))(LinearProgress);

const Step2 = ({
  setModel,
  handleStartInferencing,
  showMessage,
  downloadBtn,
  selected,
  inferenceProgress,
  isInferencing,
  session
}) => {
  const classes = useStyles();
  const { subscriptionId } = useParams();
  const [useCase, setUseCase] = useState({});
  const [groupedUsecases, setGroupedUsecases] = useState([]);
  const [selectedModels, setSelectedModels] = useState({});
  const uploadState = useSelector(({ upload }) => upload);
  const dispatch = useDispatch();
  const allImagesSelectedForInference = useSelector(
    ({ dataLibrary }) => dataLibrary.allImagesSelectedForInference
  );
  const folderFilter = useSelector(({ filters }) => filters?.folder?.applied);

  const { data: { results: models = [] } = [], isLoading } = useQuery(
    [
      'models',
      subscriptionId,
      true,
      undefined,
      `&use_case_id__in=${groupedUsecases.join(',')}`
    ],
    context => api.getMlModels(...context.queryKey),
    { enabled: !!groupedUsecases.length }
  );

  const { data: useCases } = useApi(getUseCases, {
    subscription_id: subscriptionId,
    get_all_records: true,
    allowedKeys: []
  });

  useEffect(() => {
    if (allImagesSelectedForInference && folderFilter) {
      api.distinctUseCaseForFileSets(folderFilter).then(res => {
        const tempList = [];
        if (res?.data) {
          res.data.forEach(useCase => {
            tempList.push(useCase.id);
          });
          setGroupedUsecases(tempList);
        }
      });
    }
  }, [allImagesSelectedForInference, folderFilter, dispatch]);

  useEffect(() => {
    const tempList = [];
    selected.forEach(folder => {
      if (!tempList.includes(folder.use_case)) {
        tempList.push(folder.use_case);
      }
    });
    setGroupedUsecases(tempList);
  }, [selected]);

  const handleUseCaseSelect = useCase => {
    setUseCase(useCase);
  };

  const getModelsFromUseCase = id => {
    return models.filter(model => model.use_case === id);
  };

  const handleTempModelSelect = (model, useCase) => {
    const tempModel = selectedModels;
    tempModel[useCase] = model.id;
    setSelectedModels(tempModel);
    setModel(Object.keys(tempModel).map(x => tempModel[x]));
  };

  const modelUseCases = useMemo(() => {
    return models.filter(model => model.use_case === useCase?.id);
  }, [useCase, models]);

  const handleModelSelect = model => {
    setModel(model.id);
  };

  const getUseCaseFromId = id => {
    return useCases?.results.filter(useCase => useCase.id === id)?.[0];
  };

  const handleModelInference = () => {
    setModel(Object.keys(selectedModels).map(x => selectedModels[x]));
    handleStartInferencing(
      Object.keys(selectedModels).map(x => selectedModels[x])
    );
  };

  return (
    <Box py={5} px={4}>
      <Box>
        <Box my={1}>
          <Typography variant='h1'>Select models for inferencing</Typography>
        </Box>
        <Box my={1}>
          <Typography variant='h4'>
            Select the versions of the models you’d like to Infer / Evaluate
          </Typography>
        </Box>
      </Box>
      <Box width='100%' py={5}>
        <Grid container className={classes.gridContainer}>
          {groupedUsecases.length > 0 ? (
            groupedUsecases.map((useCase, index) => (
              <React.Fragment key={index}>
                <Grid container>
                  <Grid item xs={6}>
                    <Box py={1} width={310}>
                      <Typography variant='h3'>Use Case</Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box py={1} width={310}>
                      <Typography variant='h3'>Model</Typography>
                    </Box>
                  </Grid>
                </Grid>
                <Paper elevation={0}>
                  <Grid container>
                    <Grid item xs='auto'>
                      <Box mr={1.8}>
                        <ModelSelect
                          selected={getUseCaseFromId(useCase)}
                          models={useCases?.results || []}
                          width={310}
                          // onChange={handleUseCaseSelect}
                          disabled
                        />
                      </Box>
                    </Grid>
                    <Grid item xs='auto'>
                      <ModelSelect
                        models={getModelsFromUseCase(useCase) || []}
                        width={310}
                        onChange={model =>
                          handleTempModelSelect(model, useCase)
                        }
                        loading={isLoading}
                        disabled={isInferencing || showMessage}
                      />
                    </Grid>
                  </Grid>
                </Paper>
              </React.Fragment>
            ))
          ) : (
            <>
              <Grid container>
                <Grid item xs={6}>
                  <Box py={1} width={310}>
                    <Typography variant='h3'>Use Case</Typography>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box py={1} width={310}>
                    <Typography variant='h3'>Model</Typography>
                  </Box>
                </Grid>
              </Grid>
              <Paper elevation={0}>
                <Grid container>
                  <Grid item xs='auto'>
                    <Box mr={1.8}>
                      <ModelSelect
                        // selected={getUseCaseFromId(useCase)}
                        models={useCases?.results || []}
                        width={310}
                        onChange={handleUseCaseSelect}
                      />
                    </Box>
                  </Grid>
                  <Grid item xs='auto'>
                    <ModelSelect
                      models={modelUseCases}
                      width={310}
                      onChange={handleModelSelect}
                      loading={isLoading}
                    />
                  </Grid>
                </Grid>
              </Paper>
            </>
          )}
          {downloadBtn ? null : (
            <Grid container direction='row' justifyContent='flex-end'>
              <Grid item>
                <Box py={2} mr={1.5}>
                  <CommonButton
                    text={
                      isInferencing ? (
                        <CircularProgress size={15} />
                      ) : (
                        'Start Inferencing'
                      )
                    }
                    onClick={
                      groupedUsecases.length > 0
                        ? handleModelInference
                        : handleStartInferencing
                    }
                    disabled={isInferencing || showMessage}
                  />
                </Box>
              </Grid>
            </Grid>
          )}
          {showMessage && (
            <Grid container direction='row'>
              {/* <Grid item>
							<Typography variant="h2">Your files will be inferenced soon.</Typography>
						</Grid> */}
              <Grid xs={12} item>
                <Box mr={1.5}>
                  <Box>
                    <Typography variant='body2'>
                      {Object.keys(inferenceProgress).length &&
                      inferenceProgress.total !== 0
                        ? parseInt(
                            ((inferenceProgress.finished +
                              inferenceProgress.failed) /
                              (uploadState[session.id]
                                ? uploadState[session.id].total ===
                                  uploadState[session.id].uploaded
                                  ? inferenceProgress.total
                                  : uploadState[session.id].total
                                : inferenceProgress.total)) *
                              100,
                            10
                          )
                        : 0}
                      %&nbsp;Completed
                    </Typography>
                  </Box>
                  <Box>
                    <BorderLinearProgress
                      variant='determinate'
                      value={
                        Object.keys(inferenceProgress).length &&
                        inferenceProgress.total !== 0
                          ? parseInt(
                              ((inferenceProgress.finished +
                                inferenceProgress.failed) /
                                (uploadState[session.id]
                                  ? uploadState[session.id].total ===
                                    uploadState[session.id].uploaded
                                    ? inferenceProgress.total
                                    : uploadState[session.id].total
                                  : inferenceProgress.total)) *
                                100,
                              10
                            )
                          : 0
                      }
                    />
                  </Box>
                </Box>
              </Grid>
              <Grid sm={12} item>
                <Box py={1}>
                  <Typography variant='h2'>{`Total files count: ${
                    (uploadState[session.id]
                      ? uploadState[session.id].total ===
                        uploadState[session.id].uploaded
                        ? inferenceProgress.total
                        : uploadState[session.id].total
                      : inferenceProgress.total) || 0
                  }`}</Typography>
                </Box>
              </Grid>
              <Grid sm={12} item>
                <Box py={1}>
                  <Typography variant='h2'>{`Number of files successfully inferenced: ${
                    inferenceProgress.finished ?? 0
                  }`}</Typography>
                </Box>
              </Grid>
              <Grid sm={12} item>
                <Box py={1}>
                  <Typography variant='h2'>{`Number of files failed: ${
                    inferenceProgress.failed ?? 0
                  }`}</Typography>
                </Box>
              </Grid>
            </Grid>
          )}{' '}
        </Grid>
      </Box>
    </Box>
  );
};

export default Step2;
