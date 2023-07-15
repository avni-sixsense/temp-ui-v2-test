import moment from 'moment';
import api from 'app/api';
import { isCustomDateRange } from 'app/utils/filters';
import { objectToParams } from 'app/utils/helpers';
import { getUseCases } from 'app/api/Usecase';
import { isWindow } from 'app/utils';

export const DATE_RANGE_KEYS = {
  ALL_DATE_RANGE: 'ALL_DATE_RANGE',
  TODAY: 'TODAY',
  YESTERDAY: 'YESTERDAY',
  LAST_7_DAYS: 'LAST_7_DAYS',
  LAST_30_DAYS: 'LAST_30_DAYS',
  THIS_MONTH: 'THIS_MONTH',
  LAST_MONTH: 'LAST_MONTH',
  LAST_YEAR: 'LAST_YEAR'
};

const WAFER_STATUS_CONSTANTS = {
  auto_classified: 'Auto Classified',
  manually_classified: 'Manually Classified',
  manual_classification_pending: 'Pending Manual',
  pending: 'Pending',
  error: 'Error'
};

const MODEL_STATUS_CONSTANTS = {
  draft: 'Draft',
  training: 'Training',
  ready_for_deployment: 'Ready for Deployment',
  training_failed: 'Training failed',
  deployed_in_prod: 'Deployed in production',
  // deleted: 'Deleted',
  user_terminated: 'Terminated by user',
  retired: 'Retired after deployment'
};

const GT_ADDITIONAL_DEFETCS = [
  { id: 'no_gt', name: 'No Label' },
  { id: 'NVD', name: 'No Defects' }
];

export const DEFAULT_DATE_RANGE = DATE_RANGE_KEYS.LAST_30_DAYS;

export const dateRanges = {
  [DATE_RANGE_KEYS.ALL_DATE_RANGE]: [
    moment('2020-01-01-00-00-00', 'YYYY-MM-DD-HH-mm-ss').toDate(),
    moment().endOf('day').toDate()
  ],
  [DATE_RANGE_KEYS.TODAY]: [
    moment().startOf('day').toDate(),
    moment().endOf('day').toDate()
  ],
  [DATE_RANGE_KEYS.YESTERDAY]: [
    moment().subtract(1, 'days').startOf('day').toDate(),
    moment().subtract(1, 'days').endOf('day').toDate()
  ],
  [DATE_RANGE_KEYS.LAST_7_DAYS]: [
    moment().subtract(6, 'days').startOf('day').toDate(),
    moment().endOf('day').toDate()
  ],
  [DEFAULT_DATE_RANGE]: [
    moment().subtract(29, 'days').startOf('day').toDate(),
    moment().endOf('day').toDate()
  ],
  [DATE_RANGE_KEYS.THIS_MONTH]: [
    moment().startOf('month').startOf('day').toDate(),
    moment().endOf('month').endOf('day').toDate()
  ],
  [DATE_RANGE_KEYS.LAST_MONTH]: [
    moment().subtract(1, 'month').startOf('month').startOf('day').toDate(),
    moment().subtract(1, 'month').endOf('month').endOf('day').toDate()
  ],
  [DATE_RANGE_KEYS.LAST_YEAR]: [
    moment().subtract(12, 'month').startOf('day').toDate(),
    moment().endOf('day').toDate()
  ]
};

export const FILTER_IDS = Object.freeze({
  DATE: 'date',
  FOLDER: 'folder',
  TAGS_UPLOAD: 'tags_upload',
  TAGS_FILE_SET: 'tags_file_set',
  TAGS_WAFER_MAP: 'tags_wafer_map',
  USE_CASE: 'use_case',
  BOOKMARK: 'bookmark',
  MORE: 'more',
  WAFER: 'wafer',
  MODEL: 'model',
  MODEL_STATUS: 'model_status',
  DEFECTS: 'defects',
  GROUND_TRUTH: 'ground_truth',
  WAFER_STATUS: 'wafer_status',
  REVIEWED: 'reviewed',
  IMAGE_TAG: 'image_tag',
  AUTO_CLASSIFIED: 'auto_classified',
  AI_OUTPUT: 'ai_output',
  TRAINING_TYPE: 'training_type'
});

const filterApi = Object.freeze({
  [FILTER_IDS.FOLDER]: {
    getList: ({
      limit,
      offset = 0,
      params,
      subscriptionId,
      cursor,
      search
    }) => {
      return api.getUploadSessionsFilters(
        '',
        limit,
        offset,
        params,
        subscriptionId,
        cursor,
        search
      );
    },

    getListByIds: ({ subscriptionId, ids }) => {
      return api.getUploadSessionsByIds('', subscriptionId, ids);
    }
  },

  [FILTER_IDS.USE_CASE]: {
    getList: ({ subscriptionId, params, cursor, ...rest }) => {
      return getUseCases({
        subscription_id: subscriptionId,
        cursor: cursor === true ? '' : undefined,
        ...rest,
        allowedKeys: []
      });
    },

    getListByIds: ({ subscriptionId, params, ids, ...rest }) => {
      return getUseCases({
        subscription_id: subscriptionId,
        id__in: ids,
        ...rest,
        allowedKeys: []
      });
    }
  },

  [FILTER_IDS.TAGS_UPLOAD]: {
    getList: ({ cursor, search }) => {
      return api.getAllPaginatedUploadSessionsTags('', cursor, search);
    },

    getListByIds: ({ ids }) => {
      return api.getAllUploadSessionsTags('', ids);
    }
  },

  [FILTER_IDS.TAGS_FILE_SET]: {
    getList: ({ cursor, search }) => {
      return api.getAllPaginatedFilesetTags('', cursor, search);
    },

    getListByIds: ({ ids }) => {
      return api.getAllFilesetTags('', ids);
    }
  },

  [FILTER_IDS.TAGS_WAFER_MAP]: {
    getList: ({ cursor, search }) => {
      return api.getAllPaginatedWaferTags('', cursor, search);
    },

    getListByIds: ({ ids }) => {
      return api.getAllWaferTags('', ids);
    }
  },

  [FILTER_IDS.WAFER]: {
    getList: ({ cursor, search, params }) => {
      return api.getPaginateWaferMap('', cursor, search, params);
    },

    getListByIds: ({ ids }) => {
      return api.getWaferMap('', ids);
    }
  },

  [FILTER_IDS.MODEL]: {
    getList: ({ subscriptionId, cursor, search, params }) => {
      return api.getPaginatedMlModels(
        '',
        subscriptionId,
        false,
        cursor,
        search,
        objectToParams(params)
      );
    },

    getListByIds: ({ subscriptionId, ids }) => {
      return api.getMlModels('', subscriptionId, false, ids);
    }
  },

  [FILTER_IDS.DEFECTS]: {
    getList: ({ subscriptionId, cursor, search, params }) => {
      return api.getDefects('', subscriptionId, cursor, search);
    },

    getListByIds: ({ subscriptionId, ids }) => {
      return api.getDefectsByIds('', subscriptionId, ids);
    }
  },

  [FILTER_IDS.GROUND_TRUTH]: {
    getList: ({ subscriptionId, cursor, search, params }) => {
      return api.getDefects('', subscriptionId, cursor, search);
    },

    getListByIds: ({ subscriptionId, ids }) => {
      return api.getDefectsByIds('', subscriptionId, ids);
    }
  },

  [FILTER_IDS.IMAGE_TAG]: {
    getList: ({ cursor, search }) => {
      return api.getAllPaginatedFilesetTags('', cursor, search);
    },

    getListByIds: ({ ids }) => {
      return api.getAllFilesetTags('', ids);
    }
  },

  [FILTER_IDS.AI_OUTPUT]: {
    getList: ({ subscriptionId, cursor, search, params }) => {
      return api.getDefects('', subscriptionId, cursor, search);
    },

    getListByIds: ({ subscriptionId, ids }) => {
      return api.getDefectsByIds('', subscriptionId, ids);
    }
  }
});

export function getDefaultDateValue(defaultValue) {
  const queryString = require('query-string');
  const { decodeURL } = require('app/utils/helpers');
  const { dateRangeFormatter } = require('app/utils/date');

  const decodedUrl = queryString.parse(window.location.search);

  const contextualFilters = decodeURL(decodedUrl.contextual_filters);

  let defaultVal;

  if (contextualFilters.date) {
    defaultVal = isCustomDateRange(contextualFilters.date)
      ? {
          label: dateRangeFormatter(contextualFilters.date).join(','),
          value: contextualFilters.date
        }
      : {
          label: contextualFilters.date,
          value: dateRanges[contextualFilters.date]
        };
  } else {
    defaultVal = { label: defaultValue, value: dateRanges[defaultValue] };
  }

  return defaultVal;
}

export const FILTERS_META = Object.freeze({
  [FILTER_IDS.DATE]: (defaultValue = DEFAULT_DATE_RANGE) => {
    return {
      type: 'date',
      url_key: 'date',
      isMultiSelect: false,
      shouldCache: false,
      defaultValue: getDefaultDateValue(defaultValue)
    };
  },
  [FILTER_IDS.FOLDER]: {
    url_key: `upload_session_id__in`,
    type: 'select',
    label: 'Folder',
    isMultiSelect: true,
    shouldCache: false,
    titleGetter: d => `${d.name} (${d.file_sets})`,
    ...filterApi[FILTER_IDS.FOLDER]
  },
  [FILTER_IDS.TAGS_UPLOAD]: {
    url_key: 'tags__in',
    type: 'select',
    label: 'Folder Tag',
    isMultiSelect: true,
    shouldCache: false,
    ...filterApi[FILTER_IDS.TAGS_UPLOAD]
  },
  [FILTER_IDS.TAGS_FILE_SET]: {
    url_key: 'tags__in',
    type: 'select',
    label: 'Tags',
    isMultiSelect: true,
    shouldCache: false,
    ...filterApi[FILTER_IDS.TAGS_FILE_SET]
  },
  [FILTER_IDS.TAGS_WAFER_MAP]: {
    url_key: 'tags__in',
    type: 'select',
    label: 'Tags',
    isMultiSelect: true,
    shouldCache: false,
    ...filterApi[FILTER_IDS.TAGS_WAFER_MAP]
  },
  [FILTER_IDS.USE_CASE]: {
    url_key: 'use_case_id__in',
    type: 'select',
    label: 'Use Case',
    isMultiSelect: true,
    shouldCache: false,
    ...filterApi[FILTER_IDS.USE_CASE]
  },
  [FILTER_IDS.BOOKMARK]: {
    url_key: 'is_bookmarked',
    type: 'select',
    label: 'Bookmark',
    isMultiSelect: false,
    shouldCache: false,
    defaultOptions: [
      { id: 'bookmarked', name: 'Bookmarked', value: true },
      { id: 'notBookmarked', name: 'Not Bookmarked', value: false }
    ]
  },
  [FILTER_IDS.MORE]: filters => ({
    url_key: 'more',
    type: 'select',
    label: 'More',
    isMultiSelect: true,
    shouldCache: false,
    defaultOptions: filters.map(({ id, label }) => ({ id, name: label }))
  }),
  [FILTER_IDS.WAFER]: {
    url_key: 'wafer_id__in',
    type: 'select',
    label: 'Wafer Id',
    isMultiSelect: true,
    shouldCache: false,
    titleGetter: d => d.organization_wafer_id,
    ...filterApi[FILTER_IDS.WAFER]
  },
  [FILTER_IDS.MODEL]: {
    url_key: 'ml_model_id__in',
    type: 'select',
    label: 'Model',
    isMultiSelect: true,
    shouldCache: false,
    ...filterApi[FILTER_IDS.MODEL]
  },
  [FILTER_IDS.MODEL_STATUS]: {
    url_key: 'status__in',
    type: 'select',
    label: 'Status',
    isMultiSelect: true,
    shouldCache: false,
    defaultOptions: Object.entries(MODEL_STATUS_CONSTANTS).map(
      ([key, value]) => ({ id: key, name: value, value: key })
    )
  },
  [FILTER_IDS.DEFECTS]: {
    url_key: 'defect_id__in',
    type: 'select',
    label: 'Defects',
    isMultiSelect: true,
    shouldCache: false,
    titleGetter: d => {
      return `${d.organization_defect_code}-${d.name}`;
    },
    ...filterApi[FILTER_IDS.DEFECTS]
  },
  [FILTER_IDS.GROUND_TRUTH]: {
    url_key: 'ground_truth_label__in',
    type: 'select',
    label: 'Label',
    isMultiSelect: true,
    shouldCache: false,
    titleGetter: d => {
      if (d.organization_defect_code) {
        return `${d.organization_defect_code}-${d.name}`;
      } else {
        return d.name;
      }
    },
    additionalOptions: GT_ADDITIONAL_DEFETCS,
    ...filterApi[FILTER_IDS.GROUND_TRUTH]
  },
  [FILTER_IDS.WAFER_STATUS]: {
    url_key: 'status__in',
    type: 'select',
    label: 'Wafer Status',
    isMultiSelect: true,
    shouldCache: false,
    defaultOptions: Object.entries(WAFER_STATUS_CONSTANTS).map(
      ([key, value]) => ({ id: key, name: value, value: key })
    )
  },
  [FILTER_IDS.REVIEWED]: {
    url_key: 'is_reviewed',
    type: 'select',
    label: 'Reviewed',
    isMultiSelect: false,
    shouldCache: false,
    defaultOptions: [
      { id: 1, name: 'Yes', value: true },
      { id: 2, name: 'No', value: false }
    ]
  },
  [FILTER_IDS.IMAGE_TAG]: {
    url_key: 'tags__in',
    type: 'select',
    label: 'Image Tag',
    isMultiSelect: true,
    shouldCache: false,
    ...filterApi[FILTER_IDS.IMAGE_TAG]
  },
  [FILTER_IDS.AUTO_CLASSIFIED]: {
    url_key: 'is_confident_defect',
    type: 'select',
    label: 'Auto-classified',
    isMultiSelect: false,
    shouldCache: false,
    defaultOptions: [
      { id: 1, name: 'Yes', value: true },
      { id: 2, name: 'No', value: false }
    ]
  },
  [FILTER_IDS.AI_OUTPUT]: {
    url_key: 'ai_predicted_label__in',
    type: 'select',
    label: 'AI Output',
    isMultiSelect: true,
    shouldCache: false,
    titleGetter: d => {
      if (d.organization_defect_code) {
        return `${d.organization_defect_code}-${d.name}`;
      } else {
        return d.name;
      }
    },
    ...filterApi[FILTER_IDS.AI_OUTPUT]
  },
  [FILTER_IDS.TRAINING_TYPE]: {
    url_key: 'train_type__in',
    type: 'select',
    label: 'Training Type',
    isMultiSelect: false,
    shouldCache: false,
    defaultOptions:
      isWindow() && window.location.pathname.includes('dashboard')
        ? [
            { id: 1, name: 'Training', value: 'TRAIN' },
            { id: 2, name: 'Testing', value: 'TEST,VALIDATION' }
          ]
        : [
            { id: 'TRAIN', name: 'Training', value: 'TRAIN' },
            {
              id: 'TEST,VALIDATION',
              name: 'Testing',
              value: 'TEST,VALIDATION'
            },
            {
              id: 'NOT_TRAINED',
              name: 'Not used for training',
              value: 'NOT_TRAINED'
            }
          ]
  }
});

const PAGINATION_PARAMS = ['limit', 'offset', 'cursor'];
const DATE_PARAMS = [
  'date__gte',
  'date__lte',
  'created_ts_before',
  'created_ts_after'
];
const SUBSCRIPTION_PARAMS = ['subscription_id'];

export const FILTERS_ALLOWED_API_KEYS = Object.freeze({
  [FILTER_IDS.FOLDER]: [
    ...PAGINATION_PARAMS,
    ...DATE_PARAMS,
    ...SUBSCRIPTION_PARAMS
  ],
  [FILTER_IDS.TAGS_UPLOAD]: [...PAGINATION_PARAMS],
  [FILTER_IDS.TAGS_FILE_SET]: [...PAGINATION_PARAMS],
  [FILTER_IDS.TAGS_WAFER_MAP]: [...PAGINATION_PARAMS],
  [FILTER_IDS.USE_CASE]: [...PAGINATION_PARAMS, ...SUBSCRIPTION_PARAMS],
  [FILTER_IDS.BOOKMARK]: [],
  [FILTER_IDS.MORE]: [],
  [FILTER_IDS.WAFER]: [...PAGINATION_PARAMS, ...SUBSCRIPTION_PARAMS],
  [FILTER_IDS.MODEL]: [...PAGINATION_PARAMS, ...SUBSCRIPTION_PARAMS],
  [FILTER_IDS.MODEL_STATUS]: [],
  [FILTER_IDS.DEFECTS]: [...PAGINATION_PARAMS, ...SUBSCRIPTION_PARAMS],
  [FILTER_IDS.GROUND_TRUTH]: [...PAGINATION_PARAMS],
  [FILTER_IDS.WAFER_STATUS]: [],
  [FILTER_IDS.REVIEWED]: [],
  [FILTER_IDS.IMAGE_TAG]: [...PAGINATION_PARAMS],
  [FILTER_IDS.AUTO_CLASSIFIED]: [],
  [FILTER_IDS.AI_OUTPUT]: [...PAGINATION_PARAMS]
});
