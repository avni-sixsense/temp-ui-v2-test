import Box from '@material-ui/core/Box';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import clsx from 'clsx';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { setModelName } from 'store/modelTraining/actions';
import {
  selectIsModelNameError,
  selectModelName,
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
    color: theme.colors.grey[13],
    marginRight: theme.spacing(1)
  },
  textField: {
    backgroundColor: theme.colors.grey[0],
    marginTop: theme.spacing(0.8),
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
  }
}));

const mapTrainingToState = createStructuredSelector({
  modelName: selectModelName,
  usecase: selectTrainingUsecase,
  oldModel: selectOldModel,
  isSameModelNameError: selectIsModelNameError
});

const Step1 = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const {
    modelName,
    usecase,
    oldModel: model,
    isSameModelNameError
  } = useSelector(mapTrainingToState);

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
        pb={4}
        px={1.25}
      >
        <Box mb={1.5} display='flex' alignItems='center'>
          <Typography className={classes.usecaseText}>
            Enter new Model Name
          </Typography>
          <TextField
            className={clsx(classes.textField, {
              [classes.textFieldBorder]: !isSameModelNameError,
              [classes.textFieldErrorBorder]: isSameModelNameError
            })}
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
        </Box>
        <Box display='flex' alignItems='center'>
          <Box display='flex' alignItems='center' mr={4.5}>
            <Typography className={classes.title}>Base Model</Typography>

            <Typography className={classes.value}>
              {model?.name || ''}
            </Typography>
          </Box>
          <Box display='flex' alignItems='center' mr={4.5}>
            <Typography className={classes.title}>Usecase</Typography>
            <Typography className={classes.value}>
              {usecase?.name || ''}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Step1;
