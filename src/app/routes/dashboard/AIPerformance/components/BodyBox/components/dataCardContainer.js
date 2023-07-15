import Box from '@material-ui/core/Box';
import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import api from 'app/api';
import Label from 'app/components/Label';
import CommonButton from 'app/components/ReviewButton';
import Show from 'app/hoc/Show';
import WithCondition from 'app/hoc/WithCondition';
import { useEffect, useState } from 'react';
import { useQuery, useQueryClient } from 'react-query';
import { useSelector } from 'react-redux';
import { useLocation, useParams } from 'react-router-dom';
import {
  AI_PERFORMANCE_ROUTES,
  MODEL_PERFORMANCE
} from 'store/aiPerformance/constants';
import { selectIsFilterLoading } from 'store/filter/selector';

import { DataCard } from 'app/components/DataCard';

const { MONITORING, ON_DEMAND_AUDIT, UAT, UNIT_IMAGES, UNIT_WAFER } =
  AI_PERFORMANCE_ROUTES;

const useStyles = makeStyles(theme => ({
  infoText: {
    fontSize: '0.8125rem',
    fontWeight: 400,
    color: theme.colors.grey[10]
  },
  errorContainer: {
    display: 'flex',
    gap: theme.spacing(1),
    padding: theme.spacing(1, 2.5),
    alignItems: 'center'
  }
}));

// [UNIT_WAFER]: [
// 	['Auto-classified Wafers %', 'percentage', true, {}],
// 	['Wafers received for classification', 'total', false, { ml_model_status__in: 'deployed_in_prod,retired' }],
// 	[
// 		'Wafers auto-classified',
// 		'auto_classified',
// 		false,
// 		{ ml_model_status__in: 'deployed_in_prod,retired', status__in: 'auto_classified' },
// 	],
// 	[
// 		'Wafers sent for manual classification',
// 		'manual',
// 		false,
// 		{ status__in: 'manually_classified,manual_classification_pending' },
// 		undefined,
// 		true,
// 	],
// 	[
// 		'Wafers on hold for manual classification',
// 		'on_hold',
// 		false,
// 		{ status__in: 'manual_classification_pending', ml_model_status__in: 'deployed_in_prod,retired' },
// 		true,
// 	],
// ],

const overAllTitle = {
  [MONITORING.path]: {
    [UNIT_WAFER.path]: [
      [
        'Auto-classified Wafers %',
        'auto_classified_percentage',
        true,
        undefined
      ],
      ['Wafers received for classification', 'total', false, {}],
      [
        'Wafers auto-classified',
        'auto_classified',
        false,
        {
          status__in: 'auto_classified'
        }
      ],
      [
        'Wafers sent for manual classification',
        'manual_all',
        false,
        {
          status__in: 'manually_classified,manual_classification_pending,error'
        },
        undefined,
        true
      ],
      [
        'Wafers on hold for manual classification',
        'on_hold',
        false,
        {
          status__in: 'manual_classification_pending'
        },
        true
      ]
    ],
    [UNIT_IMAGES.path]: [
      [
        'Auto-classified Images %',
        'auto_classified_percentage',
        true,
        {
          is_confident_defect: true,
          model_selection: 'live'
        }
      ],
      [
        'Images received for classification',
        'total',
        false,
        {
          is_live: true
        }
      ],
      [
        'Images auto-classified',
        'auto_classified',
        false,
        {
          is_confident_defect: true,
          model_selection: 'live'
        }
      ],
      [
        'Images sent for manual classification',
        'manual_classified',
        false,
        {
          is_confident_defect: false,
          model_selection: 'live'
        }
      ]
      // ['Images on hold for manual classification', 'on_hold', false, {}, true],
    ]
  },
  [ON_DEMAND_AUDIT.path]: {
    [UNIT_WAFER.path]: [
      ['Accuracy', 'accuracy_percentage', true, undefined],
      ['Wafers Audited', 'audited_wafer_count', false, undefined],
      ['Images Audited', 'audited_file_set_count', false, undefined],
      [
        'Correctly classified Images',
        'correct_classified_file_set_count',
        false,
        undefined
      ],
      ['Incorrectly classified Images', 'inaccurate', false, undefined]
    ],
    [UNIT_IMAGES.path]: [
      ['Accuracy', 'accuracy_percentage', true, undefined],
      [
        'Images Audited',
        'audited_file_set_count',
        false,
        { is_audited: true, model_selection: 'live' }
      ],
      [
        'Correctly classified Images',
        'correct_classified_file_set_count',
        false,
        { is_accurate: true, model_selection: 'live' }
      ],
      [
        'Incorrectly classified Images',
        'inaccurate',
        false,
        { is_accurate: false, model_selection: 'live' }
      ]
    ]
  },
  [UAT.path]: {
    [UNIT_WAFER.path]: [
      // ['Successful', 'successful_percentage', false, {}],
      // ['Auto-classification', 'auto_classified_percentage', true, { status__in: 'auto_classified' }],
      // ['Total wafers', 'total', false, {}],
      // [' Auto-classified Wafers', 'auto_classified', false, { status__in: 'auto_classified' }],
      // ['Successful wafers', 'successful', false, {}],
      // ['Incorrectly classified Images', 'inaccurate_files', false, {}],
    ],
    [UNIT_IMAGES.path]: [
      // [
      // 	'Auto-classification',
      // 	'auto_classified_percentage',
      // 	true,
      // 	{ is_confident_defect: true, latest_use_case_model: true },
      // ],
      // ['Accuracy', 'accuracy_percentage', true, { is_accurate: true, latest_use_case_model: true }],
      // ['Images audited', 'audited', false, { is_audited: true, latest_use_case_model: true }],
      // ['Correctly classified Images', 'accurate', false, { is_accurate: true, latest_use_case_model: true }],
      // ['Incorrectly classified Images', 'inaccurate', false, { is_accurate: false, latest_use_case_model: true }],
    ]
  },
  [MODEL_PERFORMANCE]: {
    [UNIT_WAFER.path]: [
      // ['Successful', 'successful_percentage', false, {}],
      // ['Auto-classification', 'auto_classified_percentage', true, { status__in: 'auto_classified' }],
      // ['Total wafers', 'total', false, {}],
      // [' Auto-classified Wafers', 'auto_classified', false, { status__in: 'auto_classified' }],
      // ['Successful wafers', 'successful', false, {}],
      // ['Incorrectly classified Images', 'inaccurate_files', false, {}],
    ],
    [UNIT_IMAGES.path]: [
      [
        'Auto-classification',
        'auto_classified_percentage',
        true,
        { is_confident_defect: true }
      ],
      ['Accuracy', 'accuracy_percentage', true, { is_accurate: true }],
      ['Images audited', 'audited', false, { is_audited: true }],
      ['Correctly classified Images', 'accurate', false, { is_accurate: true }],
      [
        'Incorrectly classified Images',
        'inaccurate',
        false,
        { is_accurate: false }
      ]
    ]
  }
};

const getInfoTitle = {
  [MONITORING.path]: 'Analyse auto-classification of AI 24*7',
  [ON_DEMAND_AUDIT.path]: 'Audit accuracy of model deployed in production.',
  [UAT.path]: 'Analyse auto-classification and accuracy of non-deployed model.'
};

const DataCardContainer = () => {
  const classes = useStyles();

  const queryClient = useQueryClient();

  const location = useLocation();

  const { mode, unit } = useParams();

  const [overallCards, setOverallCards] = useState([]);

  const isFilterLoading = useSelector(selectIsFilterLoading);

  const {
    data: overallData,
    isFetching: isOverallDataLoading,
    isError
  } = useQuery(
    ['overall', location.search, mode === MONITORING.path],
    context => api.fetchDataCards(...context.queryKey),
    {
      enabled:
        !!(
          mode &&
          mode !== UAT.path &&
          !(mode === MONITORING.path && unit === UNIT_WAFER.path)
        ) && !isFilterLoading,
      refetchInterval: false
    }
  );

  const { data: waferOverallData, isFetching: waferIsOverallDataLoading } =
    useQuery(
      ['overall', location.search, unit],
      context => api.WaferOverAllData(...context.queryKey),
      {
        enabled:
          mode === MONITORING.path &&
          unit === UNIT_WAFER.path &&
          !isFilterLoading,
        refetchInterval: false
      }
    );

  useEffect(() => {
    if (
      waferOverallData &&
      !waferIsOverallDataLoading &&
      mode === MONITORING.path &&
      unit === UNIT_WAFER.path
    ) {
      const tempList = [];
      overAllTitle[mode][unit].forEach(data => {
        const [title, key, isImprovement, params, isHoldCard, isErrorCard] =
          data;
        tempList.push({
          title,
          value: key.includes('percentage')
            ? `${
                waferOverallData[key] || waferOverallData[key] === 0
                  ? `${Math.ceil(waferOverallData[key])}%`
                  : 'N/A'
              }`
            : waferOverallData[key] || waferOverallData[key] === 0
            ? waferOverallData[key]
            : 'N/A',
          improvement:
            isImprovement &&
            (waferOverallData[key] || waferOverallData[key] === 0)
              ? parseInt(Math.ceil(waferOverallData[key]) - 90, 10)
              : undefined,
          onClickData: params,
          isHoldCard,
          isErrorCard:
            isErrorCard && waferOverallData?.error
              ? waferOverallData.error
              : undefined
        });
      });
      setOverallCards(tempList);
    } else if (
      overallData &&
      !isOverallDataLoading &&
      !(mode === MONITORING.path && unit === UNIT_WAFER.path)
    ) {
      const tempList = [];
      overAllTitle[mode][unit].forEach(data => {
        const [title, key, isImprovement, params, isHoldCard] = data;
        tempList.push({
          title,
          value: key.includes('percentage')
            ? `${
                overallData[key] || overallData[key] === 0
                  ? `${Math.ceil(overallData[key])}%`
                  : 'N/A'
              }`
            : overallData[key] || overallData[key] === 0
            ? overallData[key]
            : 'N/A',
          improvement:
            isImprovement && (overallData[key] || overallData[key] === 0)
              ? parseInt(Math.ceil(overallData[key]) - 90, 10)
              : undefined,
          onClickData: params,
          isHoldCard
        });
      });
      setOverallCards(tempList);
    } else {
      setOverallCards([]);
    }
  }, [overallData, waferOverallData, unit]);

  // const handleHoldCardClick = () => {
  // 	dispatch(setDrawerState(true))
  // }

  const handleRefreshCards = () => {
    queryClient.invalidateQueries('overall');
  };

  return (
    <Box mb={1}>
      <Box px={2.5} mb={1.5} display='flex' alignItems='center'>
        <Typography className={classes.infoText}>
          {getInfoTitle[mode]}
        </Typography>
      </Box>
      <Show when={isError}>
        <div className={classes.errorContainer}>
          <Label
            label='Failed to load data.'
            variant='secondary'
            size='medium'
          />
          <CommonButton text='Refresh' onClick={handleRefreshCards} />
        </div>
      </Show>
      <Show when={!isError}>
        <Box
          px={2.5}
          display='flex'
          alignItems='center'
          justifyContent='flex-start'
          flexWrap='wrap'
        >
          <WithCondition
            when={isOverallDataLoading}
            then={<CircularProgress />}
            or={<DataCard cardList={overallCards} />}
          />
        </Box>
      </Show>
    </Box>
  );
};

export default DataCardContainer;
