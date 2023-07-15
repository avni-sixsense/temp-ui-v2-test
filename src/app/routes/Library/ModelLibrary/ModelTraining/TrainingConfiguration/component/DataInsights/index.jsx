import { TextField, Typography } from '@material-ui/core';
import SSRadioGroup from 'app/components/SSRadioGroup';
import clsx from 'clsx';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { setConfigRadio, setProgressValue } from 'store/modelTraining/actions';
import { selectTrainingDataInformation } from 'store/modelTraining/selector';

import classes from './DataInsights.module.scss';

const QUESTION_LIST = [
  {
    label: 'Image resolution',
    key: 'image_resolution',
    type: 'text'
  },
  {
    label: 'Sensitivity of defect to background colours',
    key: 'sensitivity_of_defect_to_colours',
    type: 'radio',
    radioGroup: [
      {
        value: 'high',
        label: 'high'
      },
      {
        value: 'medium',
        label: 'medium'
      },
      {
        value: 'low',
        label: 'low'
      }
    ]
  },
  {
    label: 'Size of smallest defect',
    key: 'size_of_smallest_defect',
    type: 'radio',
    radioGroup: [
      {
        value: 'very_small',
        label: 'very small (<1%of image)'
      },
      {
        value: 'small',
        label: 'small (1-10% of image)'
      },
      {
        value: 'medium',
        label: 'medium (10-50% of image)'
      },
      {
        value: 'large',
        label: 'large (>50% of image)'
      }
    ]
  },
  {
    label: 'Lowest volume of training data',
    key: 'lowest_volume_of_training_data',
    type: 'radio',
    radioGroup: [
      {
        value: '<100',
        label: '<100 images'
      },
      {
        value: '>=100',
        label: '>100 images'
      }
    ]
  }
];

const getDefinedProgressValue = value => {
  if (value === '<100') {
    return {
      training_data_percentage: 80,
      validation_data_percentage: 10,
      test_data_percentage: 10
    };
  }
  return {
    training_data_percentage: 64,
    validation_data_percentage: 16,
    test_data_percentage: 20
  };
};

const mapDataInsightToState = createStructuredSelector({
  trainingDataInformation: selectTrainingDataInformation
});

const DataInsightsContainer = () => {
  const dispatch = useDispatch();

  const { trainingDataInformation } = useSelector(mapDataInsightToState);

  const handleRadioChange = (value, key) => {
    if (key === 'lowest_volume_of_training_data') {
      dispatch(setProgressValue(getDefinedProgressValue(value)));
    }

    dispatch(setConfigRadio({ [key]: value }));
  };

  return (
    <div className={classes.container}>
      <Typography className={classes.title}>
        Provide insights about data
      </Typography>

      {QUESTION_LIST.map((item, index) => (
        <div className={classes.questionContainer}>
          <Typography className={classes.questionTitle}>{`${index + 1}. ${
            item.label
          }`}</Typography>

          {item.type === 'radio' && (
            <div className={classes.radioContainer}>
              <SSRadioGroup
                options={item.radioGroup}
                direction='column'
                config={{
                  key: item.key,
                  value: trainingDataInformation[item.key],
                  onChange: handleRadioChange
                }}
              />
            </div>
          )}

          {item.type === 'text' && (
            <div className={classes.radioContainer}>
              <TextField
                className={clsx(classes.textField, {
                  [classes.textFieldBorder]: !false,
                  [classes.textFieldErrorBorder]: false
                })}
                size='small'
                variant='outlined'
                placeholder='Image Resolution'
                type='number'
                value={trainingDataInformation[item.key]}
                onChange={e => handleRadioChange(e.target.value, item.key)}
              />
            </div>
          )}
        </div>
      ))}

      {/* <div className={classes.showTrainingConfigBtn}>
				<CommonButton text="Show Training Configuration" />
			</div> */}
    </div>
  );
};

export default DataInsightsContainer;
