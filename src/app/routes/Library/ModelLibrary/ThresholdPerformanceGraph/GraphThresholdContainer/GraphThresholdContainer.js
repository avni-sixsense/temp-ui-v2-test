import classes from './GraphThresholdContainer.module.scss';
import { useState, useMemo } from 'react';
import WithCondition from 'app/hoc/WithCondition';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { useParams } from 'react-router-dom';
import { faPen } from '@fortawesome/pro-solid-svg-icons';
import CommonButton from 'app/components/ReviewButton';
import { SimilarityInputUpdate } from 'app/components/SimilarityInputUpdate';
import api from 'app/api';
import { GraphSection } from './GraphSection';

const GraphThresholdContainer = ({
  similarityThresholdValue,
  isOutDistributionDataSelected,
  inDistributionFilters,
  outDistributionFilters
}) => {
  const { modelId } = useParams();

  const [thresholdValue, setThresholdValue] = useState(
    similarityThresholdValue * 100
  );
  const [isDisabled, setIsDisabled] = useState(false);

  const onChangeHandler = value => {
    setThresholdValue(value);
  };

  const toggleIsDisabled = () => setIsDisabled(isDisabled => !isDisabled);

  const triggerAPI = () => {
    const newThresholdValue = thresholdValue ? thresholdValue : 0
    setThresholdValue(newThresholdValue)

    api.updateModelById(modelId, {
      confidence_threshold: Number(newThresholdValue) / 100
    });

    toggleIsDisabled();
  };

  const similaritySection = useMemo(
    () => (
      <div className={classes.similaritySection}>
        <div className={classes.text}>
          Similarity threshold{' '}
          {!isDisabled && (
            <span className={classes.percent}>{thresholdValue}%</span>
          )}
        </div>

        {isDisabled && (
          <SimilarityInputUpdate
            value={thresholdValue}
            onChange={onChangeHandler}
            disabled={false}
          />
        )}

        <WithCondition
          when={isDisabled}
          then={
            <>
              <CommonButton
                wrapperClass={classes.button}
                onClick={triggerAPI}
                text='Save'
              />

              <CommonButton
                wrapperClass={classes.button}
                onClick={toggleIsDisabled}
                variant='tertiary'
                text='Cancel'
              />
            </>
          }
          or={
            <CommonButton
              onClick={toggleIsDisabled}
              text='Edit'
              variant='tertiary'
              icon={<FontAwesomeIcon icon={faPen} />}
            />
          }
        />
      </div>
    ),
    [similarityThresholdValue, thresholdValue, isDisabled]
  );

  return (
    <div className={classes.container}>
      <div className={classes.innerContainer}>
        {similaritySection}

        <GraphSection
          isOutDistributionDataSelected={isOutDistributionDataSelected}
          inDistributionFilters={inDistributionFilters}
          outDistributionFilters={outDistributionFilters}
          thresholdValue={thresholdValue}
        />
      </div>
    </div>
  );
};

export { GraphThresholdContainer };
