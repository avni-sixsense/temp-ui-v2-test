import { Box, TextField, Typography } from '@material-ui/core';
import SearchBar from 'app/components/SearchBar/searchBar';
import Show from 'app/hoc/Show';
import WithCondition from 'app/hoc/WithCondition';
import { debounce } from 'app/utils';
import {
  TRAINING_EPOCH_MULTIPLIER,
  isViewDetailsHash
} from 'app/utils/modelTraining';
import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import Circle from 'assests/images/svgComponents/Circle';

import {
  setEpochCount,
  setImageResolution,
  setProgressValue
} from 'store/modelTraining/actions';
import {
  selectTrainingConfiguration,
  selectTrainingUsecase,
  selectDefectInstancesCountAdded
} from 'store/modelTraining/selector';

import MultiHandleProgress from './components/Progress/progress';

import classes from './TrainingConfig.module.scss';

const TEMP_SLIDER_VALUES = [
  {
    label: 'Train',
    key: 'training_data_percentage',
    color: '#10B981'
  },
  {
    label: 'Validation',
    key: 'validation_data_percentage',
    color: '#FBBF24'
  },
  {
    label: 'Test',
    key: 'test_data_percentage',
    color: '#06B6D4'
  }
];
const IMAGE_RESOLUTION_DATA = {
  64: {
    name: '64',
    value: 64
  },
  128: {
    name: '128',
    value: 128
  },
  256: {
    name: '256',
    value: 256
  },
  480: {
    name: '480',
    value: 480
  },
  576: {
    name: '576',
    value: 576
  },
  640: {
    name: '640',
    value: 640
  }
};

const EPOCHS_DATA = {
  50000: {
    name: '50000',
    value: 50000
  },
  100000: {
    name: '100000',
    value: 100000
  },
  150000: {
    name: '150000',
    value: 150000
  },
  200000: {
    name: '200000',
    value: 200000
  },
  250000: {
    name: '250000',
    value: 250000
  },
  300000: {
    name: '300000',
    value: 300000
  }
};

const MODAL_RANGES = {
  CLASSIFICATION_AND_DETECTION: {
    errorMsg: 'No. of epochs must be between 1 to 1000',
    minRange: 1,
    maxRange: 1000
  },
  CLASSIFICATION: {
    errorMsg: 'No. of epochs must be between 1000 and 150000',
    minRange: 1000,
    maxRange: 150000
  }
};

const setCurrentModalRange = value => {
  const { errorMsg, minRange, maxRange } = MODAL_RANGES[value];
  return { errorMsg, minRange, maxRange };
};

const mapTrainingToState = createStructuredSelector({
  trainingProgress: selectTrainingConfiguration,
  usecase: selectTrainingUsecase,
  defectInstancesCountAdded: selectDefectInstancesCountAdded
});

const TrainingConfigContainer = ({
  disabled,
  setDisabled,
  isSliderDisabled = false
}) => {
  const dispatch = useDispatch();

  const { trainingProgress, usecase, defectInstancesCountAdded } =
    useSelector(mapTrainingToState);

  const isViewDetails = isViewDetailsHash();

  const [progessVal, setProgressVal] = useState({
    test_data_percentage: trainingProgress.test_data_percentage,
    training_data_percentage: trainingProgress.training_data_percentage,
    validation_data_percentage: trainingProgress.validation_data_percentage
  });
  const [error, setError] = useState(null);

  const handleTrainingProgressChange = () => {
    dispatch(
      setEpochCount(
        Math.max(
          Math.min(
            calculateImageCount(progessVal.training_data_percentage) *
              TRAINING_EPOCH_MULTIPLIER,
            150000
          ),
          1000
        )
      )
    );

    dispatch(setProgressValue(progessVal));
  };

  const calculateImageCount = value => {
    return Math.round((value * defectInstancesCountAdded) / 100);
  };

  const handleEpochChange = event => {
    const { value } = event.target;

    dispatch(setEpochCount(value));

    const { errorMsg, minRange, maxRange } = setCurrentModalRange(usecase.type);

    if (!value || value < minRange || value > maxRange) {
      setError(errorMsg);
      if (!disabled) setDisabled(true);
    } else {
      setError(false);
      if (disabled) setDisabled(false);
    }
  };

  const handleResolutionChange = data => {
    dispatch(setImageResolution(data.value || 576));
  };

  useEffect(() => {
    if (!IMAGE_RESOLUTION_DATA[trainingProgress.image_resolution]) {
      handleResolutionChange(IMAGE_RESOLUTION_DATA[576]);
    }
  }, []);

  useEffect(() => {
    if (!trainingProgress.no_of_epochs) {
      dispatch(
        setEpochCount(
          Math.max(
            Math.min(
              calculateImageCount(progessVal.training_data_percentage) *
                TRAINING_EPOCH_MULTIPLIER,
              150000
            ),
            1000
          )
        )
      );
    }
  }, []);

  return (
    <div className={classes.container}>
      <Show when={!isViewDetails}>
        <div className={classes.headerContainer}>
          <Typography className={classes.header}>
            Customise Training configurations
          </Typography>
        </div>
      </Show>

      <div>
        <Typography className={classes.title}>
          1. Training, Test and Validation data split
        </Typography>

        <div className={classes.sliderContainer}>
          <div className={classes.legendsContainer}>
            {TEMP_SLIDER_VALUES.map(({ key, label, color }) => (
              <div key={key} className={classes.legendContainer}>
                <Typography className={classes.legend}>
                  <Circle color={color} />{' '}
                  {`${label}: ~${progessVal[key]}% (${calculateImageCount(
                    progessVal[key]
                  )} defect instances)`}
                </Typography>
              </div>
            ))}
          </div>

          <MultiHandleProgress
            handles={TEMP_SLIDER_VALUES.map(item => item.key)}
            initialValue={progessVal}
            setInitialValue={setProgressVal}
            onProgressChangeEnd={handleTrainingProgressChange}
            colors={['#10B981', '#FBBF24', '#06B6D4']}
            disabled={isSliderDisabled}
          />
        </div>
      </div>

      <div className={classes.epochContainer}>
        <Typography className={classes.title}>2. No. Of Epochs: </Typography>

        <Box>
          <WithCondition
            when={!isViewDetails}
            then={
              <TextField
                value={trainingProgress.no_of_epochs}
                onChange={handleEpochChange}
                placeholder='Enter Epoch'
                variant='outlined'
                size='small'
                error={error}
                helperText={error}
              />
            }
            or={
              <Typography className={classes.value}>
                {trainingProgress.no_of_epochs}
              </Typography>
            }
          />
        </Box>
      </div>

      <div className={classes.epochContainer}>
        <Typography className={classes.title}>
          3. Image resolution for Model Training:{' '}
        </Typography>

        <Box>
          <WithCondition
            when={!isViewDetails}
            then={
              <SearchBar
                fullWidth
                data={Object.values(IMAGE_RESOLUTION_DATA)}
                value={
                  IMAGE_RESOLUTION_DATA[trainingProgress.image_resolution]
                    ? [IMAGE_RESOLUTION_DATA[trainingProgress.image_resolution]]
                    : []
                }
                setValue={handleResolutionChange}
                multiple={false}
                variant='outlined'
                placeholder='Select Image Resolution'
              />
            }
            or={
              <Typography className={classes.value}>
                {IMAGE_RESOLUTION_DATA[trainingProgress.image_resolution]?.name}
              </Typography>
            }
          />
        </Box>
      </div>
    </div>
  );
};

export default TrainingConfigContainer;
