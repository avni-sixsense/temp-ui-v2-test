import { useMemo, useEffect } from 'react';
import { CssBaseline, ThemeProvider, Tooltip } from '@material-ui/core';
import QuestionMark from 'assests/images/icons/questionMark';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter } from '@fortawesome/pro-solid-svg-icons';
import classes from './FilterGraphContainer.module.scss';
import reviewTheme from 'app/configs/reviewTheme';
import CommonButton from 'app/components/ReviewButton';
import { useState } from 'react';
import { DailogBox } from './DailogBox';
import WithCondition from 'app/hoc/WithCondition';
import classnames from 'classnames';
import {
  DATE_RANGE_KEYS,
  FILTERS_META,
  FILTER_IDS
} from 'app/constants/filters';
import { GraphThresholdContainer } from '../GraphThresholdContainer';
import { FilterAsync } from 'app/components/FiltersV2';
import { isEmptyObject } from 'app/utils/helpers';
import Show from 'app/hoc/Show';

const {
  DATE,
  FOLDER,
  GROUND_TRUTH,
  WAFER,
  BOOKMARK,
  TRAINING_TYPE,
  IMAGE_TAG
} = FILTER_IDS;

const DEFAULT_DATE_OBJECT = {
  [DATE]: { url_key: DATE, selectedOptions: DATE_RANGE_KEYS.ALL_DATE_RANGE }
};

const DEFAULT_TRAINING_TYPE_OBJECT = {
  [TRAINING_TYPE]: {
    url_key: FILTERS_META[FILTER_IDS.TRAINING_TYPE]['url_key'],
    selectedOptions: [
      {
        id: 'TRAIN',
        name: 'Training',
        value: 'TRAIN'
      },
      {
        id: 'TEST,VALIDATION',
        name: 'Testing',
        value: 'TEST,VALIDATION'
      }
    ]
  }
};

const FilterGraphContainer = ({ similarityThresholdValue, filterValues }) => {
  const [isDialogueBoxHidden, setIsDialogueBoxHidden] = useState(true);

  const [isChecked, setIsChecked] = useState(false);

  const toggleDialogueBox = () =>
    setIsDialogueBoxHidden(isDialogueBoxHidden => !isDialogueBoxHidden);

  const outDistributionPrimaryFilters = useMemo(
    () => [DATE, FOLDER, GROUND_TRUTH, WAFER, BOOKMARK],
    []
  );

  const inDistributionPrimaryFilters = useMemo(
    () => [
      { id: DATE, defaultValue: DATE_RANGE_KEYS.ALL_DATE_RANGE },
      {
        id: TRAINING_TYPE,
        isMultiSelect: true,
        ...DEFAULT_TRAINING_TYPE_OBJECT[TRAINING_TYPE]
      },
      WAFER,
      FOLDER,
      GROUND_TRUTH,
      BOOKMARK,
      IMAGE_TAG
    ],
    []
  );

  const [inDistributionFilters, setInDistributionFilters] = useState({});
  const [outDistributionFilters, setOutDistributionFilters] = useState({});

  useEffect(() => {
    setInDistributionFilters(
      isEmptyObject(filterValues['indistributionFilters'])
        ? {
            ...DEFAULT_DATE_OBJECT,
            ...DEFAULT_TRAINING_TYPE_OBJECT
          }
        : {
            ...DEFAULT_DATE_OBJECT,
            ...filterValues['indistributionFilters']
          }
    );

    const isEmptyOutDistributionFilters = isEmptyObject(
      filterValues['outdistributionFilters']
    );

    setOutDistributionFilters(
      isEmptyOutDistributionFilters
        ? { ...DEFAULT_DATE_OBJECT }
        : {
            ...DEFAULT_DATE_OBJECT,

            ...filterValues['outdistributionFilters']
          }
    );

    setIsChecked(!isEmptyOutDistributionFilters);
  }, [filterValues]);

  const toggleIsChecked = value =>
    typeof value === 'boolean'
      ? setIsChecked(value)
      : setIsChecked(isChecked => !isChecked);

  const outDistributionDataContainer = (
    <div
      className={classnames(
        classes.distributionSet,
        classes.outDistributionStyle
      )}
    >
      <div className={classes.header}>
        <div className={classes.headerText}>Selected out-distribution data</div>
        <Tooltip title='Images with defect labels (ground truth) other than the training ones'>
          <div>
            <QuestionMark width='10' height='12' color='#3E5680' />
          </div>
        </Tooltip>
      </div>

      <FilterAsync
        primaryFilters={outDistributionPrimaryFilters}
        data={outDistributionFilters}
        setData={setOutDistributionFilters}
        mode='view'
      />
    </div>
  );

  return (
    <ThemeProvider theme={reviewTheme}>
      <CssBaseline />
      <>
        <Show when={!isDialogueBoxHidden}>
          <DailogBox
            toggleDialogueBox={toggleDialogueBox}
            isChecked={isChecked}
            toggleIsChecked={toggleIsChecked}
            inDistributionFilters={inDistributionFilters}
            setInDistributionFilters={setInDistributionFilters}
            outDistributionFilters={outDistributionFilters}
            setOutDistributionFilters={setOutDistributionFilters}
            inDistributionPrimaryFilters={inDistributionPrimaryFilters}
            outDistributionPrimaryFilters={outDistributionPrimaryFilters}
          />
        </Show>

        <div className={classes.container}>
          <div className={classes.distributionSet}>
            <div className={classes.header}>
              <div className={classes.headerText}>
                Selected in-distribution data
              </div>{' '}
              <Tooltip title='Images with defect labels (ground truth) on which the model was trained '>
                <div>
                  <QuestionMark width='10' height='12' color='#3E5680' />
                </div>
              </Tooltip>
            </div>

            <FilterAsync
              primaryFilters={inDistributionPrimaryFilters}
              data={inDistributionFilters}
              setData={setInDistributionFilters}
              mode='view'
            />

            <div className={classes.btnContainer}>
              <div>
                <CommonButton
                  wrapperClass={classes.actionBtn}
                  size='xs'
                  icon={<FontAwesomeIcon icon={faFilter} />}
                  onClick={toggleDialogueBox}
                  text='Change Filters'
                  variant='tertiary'
                />
              </div>
            </div>
          </div>

          <WithCondition when={isChecked} then={outDistributionDataContainer} />
        </div>

        <GraphThresholdContainer
          similarityThresholdValue={similarityThresholdValue}
          isOutDistributionDataSelected={isChecked}
          inDistributionFilters={inDistributionFilters}
          outDistributionFilters={outDistributionFilters}
        />
      </>
    </ThemeProvider>
  );
};

export { FilterGraphContainer };
