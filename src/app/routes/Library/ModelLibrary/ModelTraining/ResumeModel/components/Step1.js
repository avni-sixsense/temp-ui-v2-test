import { Grid, Tooltip } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import api from 'app/api';
import { getUseCases } from 'app/api/Usecase';
import SearchBar from 'app/components/SearchBar/searchBar';
import useApi from 'app/hooks/useApi';
import clsx from 'clsx';
import React, { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { createStructuredSelector } from 'reselect';
import {
  setModelName,
  setModelUseCase,
  setOldModel
} from 'store/modelTraining/actions';
import {
  selectIsModelNameError,
  selectIsTrainingEdit,
  selectModelName,
  selectNewTrainingModel,
  selectOldModel,
  selectTrainingUsecase
} from 'store/modelTraining/selector';

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.colors.grey[1],
    height: '100%'
  },
  header: {
    fontSize: '1rem',
    fontWeight: 500,
    color: theme.colors.grey[15]
  },
  usecaseText: {
    fontSize: '0.75rem',
    fontWeight: 500,
    color: theme.colors.grey[13]
  },
  usecaseSelector: {
    width: '260px'
  },
  selector: {
    paddingLeft: theme.spacing(1)
  },
  textField: {
    backgroundColor: theme.colors.grey[0],
    width: '260px',
    '& input': {
      color: theme.colors.grey[18],
      fontSize: '0.875rem',
      fontWeight: 500
    }
  },
  textFieldBorder: {
    '& fieldset': {
      border: `0.2px solid ${theme.colors.grey[5]}`,
      boxShadow: theme.colors.shadow.sm,
      borderRadius: '4px'
    },
    '& div:hover fieldset, .Mui-focused fieldset': {
      border: `0.2px solid ${theme.colors.grey[5]} !important`,
      boxShadow: theme.colors.shadow.sm,
      borderRadius: '4px'
    }
  },
  textFieldErrorBorder: {
    '& fieldset': {
      border: `0.2px solid ${theme.colors.red[600]}`,
      boxShadow: theme.colors.shadow.sm,
      borderRadius: '4px'
    },
    '& div:hover fieldset, .Mui-focused fieldset': {
      border: `0.2px solid ${theme.colors.red[600]} !important`,
      boxShadow: theme.colors.shadow.sm,
      borderRadius: '4px'
    }
  },
  modelNameContainer: {
    backgroundColor: theme.colors.grey[0],
    borderRadius: theme.spacing(0.5),
    border: `1px solid ${theme.colors.grey[3]}`
  },
  gridContainer: {
    backgroundColor: theme.colors.grey[0],
    borderRadius: theme.spacing(0.5),
    border: `1px solid ${theme.colors.grey[3]}`,
    padding: theme.spacing(2, 1.25, 2, 1.25)
  },
  title: {
    color: theme.colors.grey[13],
    fontSize: '0.75rem',
    fontWeight: 500,
    marginRight: theme.spacing(1)
  },
  value: {
    color: theme.colors.grey[19],
    fontSize: '0.875rem',
    fontWeight: 600
  },
  progress: {
    color: theme.colors.grey[19]
  },
  radioBtn: {
    paddingRight: theme.spacing(1.125)
  },
  status: {
    color: '#F2994A',
    fontSize: '14px',
    fontWeight: 700
  },
  flexAlign: {
    alignItems: 'center'
  },
  useCaseContainer: {
    borderBottom: `1px solid ${theme.colors.grey[3]}`,
    paddingBottom: '16px!important',
    marginBottom: 8
  }
}));

const mapTrainingTostate = createStructuredSelector({
  modelName: selectModelName,
  isSameModelNameError: selectIsModelNameError,
  newModel: selectNewTrainingModel,
  usecase: selectTrainingUsecase,
  oldModel: selectOldModel,
  isEdit: selectIsTrainingEdit
});

const USE_CASE_PARAMS = {
  SINGLE_LABEL_CLASSIFICATION: 'SINGLE_LABEL_CLASSIFICATION',
  MULTI_LABEL_CLASSIFICATION_AND_DETECTION: 'CLASSIFICATION_AND_DETECTION',
  MULTI_LABEL_CLASSIFICATION: 'MULTI_LABEL_CLASSIFICATION'
};

const TOOLTIP_TITLE =
  'Base model is depended on the use case type selected. Select use case to enable the base model field.';

const Step1 = () => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const { subscriptionId } = useParams();
  const [usecase, setUsecase] = useState([]);
  const [shouldFetch, setShouldFetch] = useState(false);
  const [baseModel, setBaseModel] = useState([]);

  const usecaseType = usecase[0]?.classification_type + '_' + usecase[0]?.type;

  const {
    modelName,
    isSameModelNameError,
    newModel,
    usecase: useCaseSelected,
    oldModel: oldModelSelected,
    isEdit
  } = useSelector(mapTrainingTostate);

  const { data: useCases } = useApi(getUseCases, {
    subscription_id: subscriptionId,
    get_all_records: true,
    allowedKeys: []
  });

  const { data: baseModels } = useQuery(
    ['getBaseModels', USE_CASE_PARAMS[usecaseType]],
    context => api.getBaseMlModel(...context.queryKey),
    {
      enabled: shouldFetch
    }
  );

  useEffect(() => {
    if ((useCases?.results || []).length && newModel?.use_case) {
      const items = useCases?.results.filter(
        item => item.id === newModel?.use_case
      );

      setUsecase(items);

      dispatch(setModelUseCase(items[0]));
    }
  }, [useCases, newModel]);

  useEffect(() => {
    if (useCaseSelected) {
      setUsecase(Object.keys(useCaseSelected).length ? [useCaseSelected] : []);
    }
  }, [useCaseSelected]);

  useEffect(() => {
    if (oldModelSelected)
      setBaseModel(
        Object.keys(oldModelSelected).length ? [oldModelSelected] : []
      );
  }, [oldModelSelected]);

  const handleUseCaseSelect = value => {
    setBaseModel([]);
    setShouldFetch(true);
    if (Array.isArray(value)) {
      setUsecase(value);
    } else {
      setUsecase(Object.keys(value).length ? [value] : []);
    }

    dispatch(setModelUseCase(value));
  };

  const handleModelChange = value => {
    if (Array.isArray(value)) {
      setBaseModel(value);
    } else {
      setBaseModel(Object.keys(value).length ? [value] : []);
    }

    dispatch(setOldModel(value));
  };

  const handleModelNameChange = event => {
    dispatch(setModelName(event.target.value));
  };

  return (
    <Box pt={3} px={2} className={classes.root}>
      <Box mb={2}>
        <Typography className={classes.header}>Model Details</Typography>
      </Box>
      <Box
        mb={2}
        className={classes.modelNameContainer}
        pt={2}
        px={1.25}
        pb={2}
      >
        <Grid
          container
          spacing={2}
          justifyContent='space-between'
          direction='column'
          xs={12}
        >
          <Grid
            item
            container
            xs={12}
            sm={8}
            md={12}
            lg={12}
            spacing={2}
            className={classes.flexAlign}
          >
            <Grid item xs={4} sm={4} lg={2} xl={3}>
              <Typography className={classes.usecaseText}>
                Enter new Model Name
              </Typography>
            </Grid>
            <Grid item>
              <TextField
                className={clsx(classes.textField, {
                  [classes.textFieldBorder]: !isSameModelNameError,
                  [classes.textFieldErrorBorder]: isSameModelNameError
                })}
                fullWidth
                size='small'
                variant='outlined'
                value={modelName}
                onChange={handleModelNameChange}
                InputProps={
                  {
                    // startAdornment: (
                    // 	<InputAdornment className={classes.inputAdornmentStart} position="start">
                    // 		MDL
                    // 	</InputAdornment>
                    // ),
                  }
                }
              />
            </Grid>
          </Grid>
          <Grid
            container
            item
            xs={12}
            sm={8}
            md={12}
            lg={12}
            className={`${classes.flexAlign} ${classes.useCaseContainer}`}
          >
            <Grid item xs={4} sm={4} lg={2}>
              <Typography className={classes.usecaseText}>
                Select Use Case
              </Typography>
            </Grid>
            <Grid item xs={4}>
              <Tooltip
                title={
                  isEdit
                    ? 'Added data and defect will get removed from training on changing use case arrow '
                    : ''
                }
                placement='right'
                arrow
              >
                <div>
                  <Box className={classes.usecaseSelector}>
                    <SearchBar
                      fullWidth
                      disabled={isEdit}
                      data={useCases?.results}
                      value={usecase}
                      setValue={handleUseCaseSelect}
                      multiple={false}
                      variant='outlined'
                      placeholder='Select Use Case'
                    />
                  </Box>
                </div>
              </Tooltip>
            </Grid>
          </Grid>
          <Grid
            className={classes.flexAlign}
            container
            item
            xs={12}
            sm={8}
            md={12}
            lg={12}
          >
            <Grid item xs={4} sm={4} lg={2} xl={3}>
              <Typography className={classes.usecaseText}>
                Select Base Model
              </Typography>
            </Grid>
            <Grid item xs={4}>
              <Box className={classes.usecaseSelector}>
                <SearchBar
                  fullWidth
                  disabled={isEdit}
                  data={baseModels?.results || []}
                  value={baseModel}
                  setValue={handleModelChange}
                  multiple={false}
                  variant='outlined'
                  placeholder='Select base model'
                  tooltipTitle={TOOLTIP_TITLE}
                />
              </Box>
            </Grid>
          </Grid>
        </Grid>
      </Box>
      {/* <Grid container className={classes.gridContainer}>
				<Grid item>
					<Grid container spacing={2} alignItems="flex-start">
						<Grid item>
							<Typography className={classes.usecaseSelect}>Select base model:</Typography>
						</Grid>
						<Grid item>
							<FormControl>
								<RadioGroup value={isRadioChecked} onChange={handleRadioChanges}>
									<Grid container spacing={4}>
										<Grid item>
											<Grid container direction="column">
												<Grid item>
													<FormControlLabel
														className={classes.formControl}
														value="base_model"
														control={
															<CustomizedRadio label="SixSense Base model" lightTheme />
														}
													/>
												</Grid>
												{isRadioChecked === 'base_model' && (
													<Grid item>
														<SearchBar
															fullWidth
															data={baseModels?.results}
															value={baseModel}
															setValue={handleModelChange}
															multiple={false}
															variant="outlined"
															placeholder="Select base model"
														/>
													</Grid>
												)}
											</Grid>
										</Grid>
										 <Grid item>
											<Grid container>
												<Grid item>
													<FormControlLabel
														className={classes.formControl}
														value="custome_model"
														disabled
														control={<CustomizedRadio label="custom model" lightTheme />}
													/>
												</Grid>

												<Grid item>
													<span className={classes.status}>Coming soon</span>
												</Grid>
											</Grid>
										</Grid>
									</Grid>
								</RadioGroup>
							</FormControl>
						</Grid>
					</Grid>
				</Grid>
			</Grid> */}
    </Box>
  );
};

export default Step1;
