import dayjs from 'dayjs';
import _, { keyBy, set } from 'lodash';
import memoize from 'lodash/memoize';
import moment from 'moment';
import queryString from 'query-string';
import { format } from 'date-fns';
import { toast } from 'react-toastify';
import { AI_PERFORMANCE_ROUTES } from 'store/aiPerformance/constants';
import { AUDIT, MANUAL_CLASSIFY, Review } from 'store/reviewData/constants';

import {
  AIPerformance24x7,
  AuditFlow,
  DataLibrary,
  DefectLibrary,
  FilterKey,
  ManuallyReclass,
  ModelLibrary,
  ModelRetrain,
  ModelTrain,
  OnDemandAudit,
  ReviewScreen,
  UATFilter,
  UseCaseLibrary,
  WaferBook,
  WaferLibrary
} from './filterConstants';
import IndexedDbService from 'app/services/IndexedDbService';
import { dateRanges } from 'app/constants/filters';
import { isCustomDateRange } from './filters';
import { SEARCH_PAGE_PARAMS_KEYS } from 'app/constants/searchParams';
import { toCamel } from 'app/utils/apiHelpers';

const { MONITORING, ON_DEMAND_AUDIT, UAT } = AI_PERFORMANCE_ROUTES;

const utc = require('dayjs/plugin/utc'); // dependent on utc plugin
const timezone = require('dayjs/plugin/timezone');
const customParseFormat = require('dayjs/plugin/customParseFormat');
const duration = require('dayjs/plugin/duration');

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(customParseFormat);
dayjs.extend(duration);
export const timeZone = dayjs.tz.guess();

// eslint-disable-next-line import/prefer-default-export
export function validateFiles(files) {
  const validFiles = [];
  // const nameRe = /[/\\]/
  const fileTypeRe = /\.(bmp|jpg|jpeg|tiff|tif|png)/i;
  files.forEach(i => {
    // const size = i.size / 1024 / 1024
    let hasError = false;
    // if (nameRe.test(i.name)) {
    // 	hasError = true
    // 	errors.push({
    // 		name: i.name,
    // 		error: 'Invalid file name',
    // 	})
    // }
    // if (size > 5) {
    // 	hasError = true
    // 	errors.push({
    // 		name: i.name,
    // 		error: 'File size too large',
    // 	})
    // }
    if (!fileTypeRe.test(i.name)) {
      hasError = true;
      toast.error(`${i.name} : File format not supported`);
    }

    if (!hasError) {
      validFiles.push(i);
    }
  });
  return { validFiles };
}

export async function logout() {
  const { default: store } = require('store/index');
  store.dispatch({ type: 'RESET_APP' });

  if (process.env.REACT_APP_USE_AUTH_COOKIES === 'true') {
    await IndexedDbService.setToken('');
  }

  localStorage.clear();
  sessionStorage.clear();
}

export const getTimeFormat = memoize((from, to) => {
  const diffTime = Math.abs(from - to);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  if (diffDays < 15) {
    return 'daily';
  }
  if (diffDays >= 16 && diffDays < 61) {
    return 'weekly';
  }
  return 'monthly';
});

// export function stringToColor(str) {
// 	let hash = 0
// 	for (let i = 0; i < str.length; i += 1) {
// 		// eslint-disable-next-line no-bitwise
// 		hash = str.charCodeAt(i) + ((hash << 5) - hash)
// 	}
// 	let colour = '#'
// 	for (let i = 0; i < 3; i += 1) {
// 		// eslint-disable-next-line no-bitwise
// 		const value = (hash >> (i * 8)) & 0xff
// 		colour += `00${value.toString(16)}`.substr(-2)
// 	}
// 	return colour
// }

export function adjust(color, amount) {
  return `#${color
    .replace(/^#/, '')
    .replace(/../g, color =>
      `0${Math.min(255, Math.max(0, parseInt(color, 16) + amount)).toString(
        16
      )}`.substr(-2)
    )}`;
}

function hashCode(str) {
  // java String#hashCode
  const s = `SIX${str}inifineon`;
  let hash = 0;
  for (let i = 0; i < s.length; i++) {
    hash = s.charCodeAt(i) + ((hash << 5) - hash);
  }
  return hash;
}

export function stringToColor(i) {
  const hex = hashCode(i);
  const c = (hex & 0x00ffffff).toString(16).toUpperCase();

  return `#${'00000'.substring(0, 6 - c.length)}${c}`;
}

// const FORMAT = 'YYYY-MM-DD'

export function formatDateFilter(date, FORMAT = 'yyyy-MM-dd') {
  return date.start && date.end
    ? { start: format(date.start, FORMAT), end: format(date.end, FORMAT) }
    : '';
}

export const formatDisplayDate = (value, format = 'YYYY-MM-DD HH:mm:ss') => {
  const date = dayjs(value).tz(timeZone);
  return date.format(format);
};

export const getFileSetDefectsFields = (type, isClassified) => {
  if (type === MANUAL_CLASSIFY && isClassified) {
    return 'gt_defect_names,model_defect_names';
  }
  if (type === MANUAL_CLASSIFY && !isClassified) {
    return 'model_defect_names';
  }
  if (type === AUDIT && isClassified) {
    return 'gt_defect_names';
  }
  if (type === Review) {
    return 'gt_defect_names';
  }
  return '';
};

export const getTimeDifference = date => {
  const months = dayjs().diff(date, 'month');
  const weeks = dayjs().diff(date, 'week');
  const days = dayjs().diff(date, 'day');
  const hours = dayjs().diff(date, 'hour');
  const mins = dayjs().diff(date, 'minutes');

  if (months > 0) {
    return dayjs(date).format('DD-MMM-YYYY');
  }
  if (weeks > 0) {
    return `${weeks} weeks ago`;
  }
  if (days > 0) {
    return `${days} days ago`;
  }
  if (hours > 0) {
    return `${hours} hours ago`;
  }
  if (mins > 0) {
    return `${mins} mins ago`;
  }
  return '';
};

export const getTrainingTimeDifference = (start, end) => {
  const {
    $d: { days, hours, minutes, months }
  } = dayjs.duration(dayjs(start).diff(dayjs(end)));
  return `${months > 0 ? `${months} months ` : ''}${
    days > 0 ? `${days} days ` : ''
  }${hours > 0 ? `${hours} hours ` : ''}${minutes > 0 ? `${minutes} min` : ''}`;
};

// const serialize = (obj) => {
// 	const str = []
// 	for (const p in obj)
// 		if (obj.hasOwnProperty(p)) {
// 			str.push(`${encodeURIComponent(p)}=${encodeURIComponent(obj[p])}`)
// 		}
// 	return str.join('&')
// }

export const createCursor = (isReverse, createdTs) => {
  let queryString = '';
  if (isReverse) {
    queryString = queryString.concat('r=1&');
  }
  queryString = queryString.concat(`p=${encodeURIComponent(createdTs)}`);
  const base64Encode = btoa(queryString);
  return base64Encode;
};

const getNoDefectConfig = ({ isAiRegion }) => ({
  type: 'box',
  x: 0,
  y: 0,
  w: 1,
  h: 1,
  originalX: 0,
  originalY: 0,
  originalW: 1,
  originalH: 1,
  id: 'NO_DEFECT',
  color: isAiRegion ? '#D97706' : '#2563EB',
  showTags: true,
  visible: true,
  highlight: true,
  is_ai_region: isAiRegion,
  is_user_feedback: true,
  is_new: false,
  is_updated: false,
  r_id: 'NO_DEFECT',
  // ai_region: region.ai_region,
  is_deleted: false,
  isNoDefect: true,
  // classification_correctness: region.classification_correctness,
  // detection_correctness: region.detection_correctness,
  allowedArea: {
    x: 0,
    y: 0,
    w: 1,
    h: 1
  },
  originalTags: [
    {
      id: 9999,
      name: '9999- No Defect',
      description: '',
      organization_defect_code: 'NO_DEFECT',
      code: '9999-No-Defect',
      created_ts: '',
      hot_key: null
    }
  ],
  tags: [
    {
      id: 9999,
      name: '9999- No Defect',
      description: '',
      organization_defect_code: 'NO_DEFECT',
      code: '9999-No-Defect',
      created_ts: '',
      hot_key: null
    }
  ]
});

const getRegion = ({ region, x, y, w, h, isAiRegion, updatedDefects, id }) => ({
  type: region.type,
  originalX: x,
  originalY: y,
  originalW: w,
  originalH: h,
  x,
  y,
  w,
  h,
  id: id.toString(),
  color: isAiRegion ? '#D97706' : '#2563EB',
  // cls: defect.region_id,
  showTags: true,
  visible: true,
  highlight: true,
  is_ai_region: isAiRegion,
  tags: updatedDefects,
  originalTags: updatedDefects,
  is_user_feedback: true,
  is_new: false,
  is_updated: false,
  r_id: id,
  // ai_region: region.ai_region,
  is_deleted: false,
  // classification_correctness: region.classification_correctness,
  // detection_correctness: region.detection_correctness,
  allowedArea: {
    x: 0,
    y: 0,
    w: 1,
    h: 1
  }
});

export const createDetectionRegions = (
  detectionRegions,
  isAiRegion = false,
  isNoDefect
) => {
  const tempRegions = [];

  if (isNoDefect) {
    tempRegions.push(getNoDefectConfig({ isAiRegion }));
    return tempRegions;
  }

  detectionRegions.forEach(data => {
    const { region, defects, id } = data;
    const { x, y, w, h } = region.coordinates;

    const updatedDefects = defects.map(item => ({
      ...item,
      name: `${item.organization_defect_code}-${item.name}`
    }));

    tempRegions.push(
      getRegion({ region, x, y, w, h, isAiRegion, updatedDefects, id })
    );
  });

  return tempRegions;
};

export const convertToUtc = (value, format = 'YYYY-MM-DD-HH-mm-ss') => {
  const date = dayjs(value).utc();
  return date.format(format);
};

export const getTimezoneWiseDate = (value, format = 'YYYY-MM-DD-HH-mm-ss') => {
  const date = dayjs.utc(value, format);
  return date.toDate();
};

export const formatFileSetData = data => {
  const filteredData = [];
  data.forEach(item => {
    const { metaInfo } = item;
    const sessionid = item.upload_session;
    const folder = item.upload_session_name;
    item.files.forEach(el => {
      const temp = {
        ...item,
        ...el,
        ...metaInfo
      };
      temp.id = el.id;
      temp.fileSetId = el.file_set;
      temp.Images = el.url;
      temp.src = el.url;
      temp.Folder = folder;
      temp.sessionId = sessionid;
      filteredData.push(temp);
    });
  });
  return filteredData;
};

export const ranges = {
  ALL_DATE_RANGE: [
    moment('2020-01-01-00-00-00', 'YYYY-MM-DD-HH-mm-ss').toDate(),
    moment().endOf('day').toDate()
  ],
  TODAY: [moment().startOf('day').toDate(), moment().endOf('day').toDate()],
  YESTERDAY: [
    moment().subtract(1, 'days').startOf('day').toDate(),
    moment().subtract(1, 'days').endOf('day').toDate()
  ],
  LAST_7_DAYS: [
    moment().subtract(6, 'days').startOf('day').toDate(),
    moment().endOf('day').toDate()
  ],
  LAST_30_DAYS: [
    moment().subtract(29, 'days').startOf('day').toDate(),
    moment().endOf('day').toDate()
  ],
  THIS_MONTH: [
    moment().startOf('month').startOf('day').toDate(),
    moment().endOf('month').endOf('day').toDate()
  ],
  LAST_MONTH: [
    moment().subtract(1, 'month').startOf('month').startOf('day').toDate(),
    moment().subtract(1, 'month').endOf('month').endOf('day').toDate()
  ],
  LAST_YEAR: [
    moment().subtract(12, 'month').startOf('day').toDate(),
    moment().endOf('day').toDate()
  ]
};

export const getTimeFormatFromTimeRange = range => {
  const timeFormatRanges = {
    ALL_DATE_RANGE: 'monthly',
    TODAY: 'daily',
    YESTERDAY: 'daily',
    LAST_7_DAYS: 'daily',
    LAST_30_DAYS: 'weekly',
    THIS_MONTH: 'weekly',
    LAST_MONTH: 'weekly',
    LAST_YEAR: 'monthly'
  };
  return timeFormatRanges[range] || 'daily';
};
export const getDatesFromTimeRange = range => {
  return ranges[range];
};

export const isEmptyObject = obj => !Object.entries(obj || {}).length;

export const getTimeRangeString = dateRange => {
  const [start, end] = dateRange;

  let rangeString = '';
  Object.keys(ranges).forEach(range => {
    const [dateStart, dateEnd] = ranges[range];

    if (
      dayjs(dateStart).diff(dayjs(start)) === 0 &&
      dayjs(dateEnd).diff(dayjs(end)) === 0
    ) {
      rangeString = range;
    }
  });

  return rangeString;
};
export const filters = {
  [AIPerformance24x7]: {
    contextual_filters: {},
    other_filters: {},
    key: AIPerformance24x7
  },
  [UATFilter]: { contextual_filters: {}, other_filters: {}, key: UATFilter },
  [OnDemandAudit]: {
    contextual_filters: {},
    other_filters: {},
    key: OnDemandAudit
  },
  [DataLibrary]: {
    contextual_filters: {},
    other_filters: {},
    key: DataLibrary
  },
  [WaferLibrary]: {
    contextual_filters: {},
    other_filters: {},
    key: WaferLibrary
  },
  [ModelLibrary]: {
    contextual_filters: {},
    other_filters: {},
    key: ModelLibrary
  },
  [ModelRetrain]: {
    contextual_filters: {},
    other_filters: {},
    key: ModelRetrain
  },
  [ModelTrain]: { contextual_filters: {}, other_filters: {}, key: ModelTrain },
  [DefectLibrary]: {
    contextual_filters: {},
    other_filters: {},
    key: DefectLibrary
  },
  [UseCaseLibrary]: {
    contextual_filters: {},
    other_filters: {},
    key: UseCaseLibrary
  },
  [ReviewScreen]: {
    contextual_filters: {},
    other_filters: {},
    key: ReviewScreen
  },
  [ManuallyReclass]: {
    contextual_filters: {},
    other_filters: {},
    key: ManuallyReclass
  },
  [AuditFlow]: { contextual_filters: {}, other_filters: {}, key: AuditFlow },
  [WaferBook]: { contextual_filters: {}, other_filters: {}, key: WaferBook }
};

export const encodeString = query => {
  return btoa(query);
};

export const encodeURL = (data = {}) => {
  const query = queryString.stringify(data, { arrayFormat: 'comma' });
  return encodeString(query);
};

export const covertToArrayFormat = data => {
  const tempObj = data;
  Object.keys(tempObj).forEach(x => {
    if (
      (x.includes('use_case_id__in') ||
        x.includes('defect_id__in') ||
        x.includes('ground_truth_label__in') ||
        x.includes('ml_model_id__in') ||
        x.includes('wafer_id__in') ||
        x.includes('tags__in') ||
        x.includes('upload_session_id__in') ||
        x.includes('ai_predicted_label__in') ||
        x.includes('training_ml_model__in') ||
        x.includes('meta_info__')) &&
      !Array.isArray(tempObj[x])
    ) {
      tempObj[x] = [tempObj[x]];
    }
  });
  return tempObj;
};

export const decodeURL = (query = '', withoutArrayFormat = false) => {
  const data = queryString.parse(atob(query), {
    arrayFormat: 'comma',
    parseNumbers: true
  });

  return withoutArrayFormat ? data : covertToArrayFormat(data);
};

export function convertToArray(val) {
  return Array.isArray(val) ? val : [val];
}

export const getDecodedURL = url => {
  const {
    contextual_filters: contextualFilters,
    other_filters: otherFilters,
    ...rest
  } = queryString.parse(url, { arrayFormat: 'comma', parseNumbers: true });

  const decodedContextual = decodeURL(contextualFilters);
  const decodedOther = decodeURL(otherFilters);
  return { decodedContextual, decodedOther, ...rest };
};

export const getParamsObjFromEncodedString = (
  encodedQuery,
  removeParamKeys = []
) => {
  const { decodedContextual, decodedOther, ...rest } =
    getDecodedURL(encodedQuery);

  const finalParam = { ...decodedContextual, ...decodedOther, ...rest };

  Object.values(SEARCH_PAGE_PARAMS_KEYS).forEach(d => {
    delete finalParam[d];
  });

  removeParamKeys.forEach(d => {
    delete finalParam[d];
  });

  return finalParam;
};

export const getParamsFromEncodedString = (
  encodedQuery,
  convertDateToCreatedTs = false,
  removeParamKeys
) => {
  const finalParamObj =
    typeof encodedQuery === 'object'
      ? encodedQuery
      : getParamsObjFromEncodedString(encodedQuery, removeParamKeys);

  const format = 'YYYY-MM-DD-HH-mm-ss';

  let dateStart, dateEnd;

  if (finalParamObj.date) {
    [dateStart, dateEnd] = isCustomDateRange(finalParamObj.date)
      ? finalParamObj.date
      : dateRanges[finalParamObj.date];

    delete finalParamObj.date;
  } else if (finalParamObj.date__lte || finalParamObj.date__gte) {
    [dateStart, dateEnd] = [finalParamObj.date__gte, finalParamObj.date__lte];
  }

  if (dateStart && dateEnd) {
    if (dayjs.utc(dateEnd).isValid()) {
      finalParamObj.date__gte = dayjs.utc(dateStart).format(format);
      finalParamObj.date__lte = dayjs.utc(dateEnd).format(format);
    } else {
      finalParamObj.date__gte = dateStart;
      finalParamObj.date__lte = dateEnd;
    }

    if (convertDateToCreatedTs) {
      finalParamObj.created_ts_after = finalParamObj.date__gte;
      finalParamObj.created_ts_before = finalParamObj.date__lte;

      delete finalParamObj.date__gte;
      delete finalParamObj.date__lte;
    }
  }

  return queryString.stringify(finalParamObj, { arrayFormat: 'comma' });
};

export const getDateFromParams = (
  encodedQuery,
  format = 'YYYY-MM-DD-HH-mm-ss',
  convertDateToCreatedTs = false
) => {
  if (typeof encodedQuery !== 'string') {
    throw new Error(`Expected string but got ${typeof encodedQuery}`);
  }

  const finalParamObj = getParamsObjFromEncodedString(encodedQuery);

  if (finalParamObj.date) {
    const [date__gte, date__lte] = isCustomDateRange(finalParamObj.date)
      ? finalParamObj.date
      : dateRanges[finalParamObj.date];

    finalParamObj.date__gte = date__gte;
    finalParamObj.date__lte = date__lte;

    delete finalParamObj.date;
  }

  if (dayjs.utc(finalParamObj.date__lte).isValid()) {
    finalParamObj.date__gte = dayjs.utc(finalParamObj.date__gte).format(format);
    finalParamObj.date__lte = dayjs.utc(finalParamObj.date__lte).format(format);
  } else if (
    !moment(finalParamObj.date__lte, format, true).isValid() &&
    format.length === 10
  ) {
    finalParamObj.date__gte = finalParamObj.date__gte.slice(0, 10);
    finalParamObj.date__lte = finalParamObj.date__lte.slice(0, 10);
  }

  if (convertDateToCreatedTs) {
    finalParamObj.created_ts_after = finalParamObj.date__gte;
    finalParamObj.created_ts_before = finalParamObj.date__lte;

    delete finalParamObj.date__gte;
    delete finalParamObj.date__lte;
  }

  return finalParamObj;
};

export const setSessionStorageFilter = (filterKey, value) => {
  const filter = sessionStorage.getItem(FilterKey);
  sessionStorage.setItem(
    FilterKey,
    JSON.stringify(set(filter, filterKey, value))
  );
};

export const converObjArraytoString = data => {
  return Object.keys(data).reduce((prev, curr) => {
    if (Array.isArray(data[curr])) {
      return { ...prev, [curr]: data[curr].join(',') };
    }
    return { ...prev, [curr]: data[curr] };
  }, {});
};

export const calcluatePercent = value =>
  (Number(value).toFixed(2) * 100 || 0) + '%';

export const NumberFormater = value => {
  if (value) {
    return value.toLocaleString();
  }
  return value;
};
export const createDefectNameWithCode = defect => {
  return {
    ...defect,
    name: `${defect.organization_defect_code}-${defect.name}`
  };
};
// input = [{defects: [{name: 'abc'}]}] ==> ['abc (2)', bcd]
export const precedenceDefectOccurances = (defects = []) => {
  const newDefects = {};

  defects.forEach(({ defects }) => {
    defects.forEach(({ name }) => {
      if (name in newDefects) {
        newDefects[name] = newDefects[name] + 1;
      } else {
        newDefects[name] = 1;
      }
    });
  });

  return Object.entries(newDefects).map(defect => {
    const value = defect[1];
    if (value === 1) return defect[0];

    return defect[0] + ` (${defect[1]})`;
  });
};

export const getGTDefects = (data, defectType = 'CLASSIFICATION') => {
  let defects = [];

  if (defectType === 'CLASSIFICATION') {
    const defects = (
      data?.gt_classifications?.classification_defects ?? []
    ).map(item => createDefectNameWithCode(item.defect));

    return defects;
  }

  defects = precedenceDefectOccurances(data?.gt_detections?.detection_regions);

  return defects;
};

export const getAIDefects = data => {
  const tempObj = {};
  const modelDataByKey = keyBy(data?.model_classifications || [], 'ml_model');
  Object.keys(modelDataByKey).forEach(key => {
    tempObj[key] = modelDataByKey[key].classification_defects.map(data => {
      return {
        ...createDefectNameWithCode(data.defect),
        confidence: data.confidence,
        ml_model_id: key
      };
    });
  });
  return tempObj || {};
};

export const getGTDefectsLabels = data => {
  return getGTDefects(data).map(x => x.name);
};

export const getAIDefectsLabels = data => {
  return (Object.values(getAIDefects(data))?.[0] || []).map(x => x.name);
};
export const getAIConfidence = data => {
  return (Object.values(getAIDefects(data))?.[0] || []).map(x => x.confidence);
};

export const getMlModelsFromAIDefects = data => {
  const modelList = [];
  Object.values(data).forEach(x =>
    modelList.push(...Object.keys(getAIDefects(x)))
  );
  return modelList;
};

export const getLandingPage = (pageKey, subId, packId) => {
  switch (pageKey) {
    case 'DATA_LIBRARY':
      return `/${subId}/${packId}/library/data`;
    case 'AI_PERFORMANCE':
      return `/${subId}/${packId}/dashboard/ai-performance/${AI_PERFORMANCE_ROUTES.MONITORING.path}/${AI_PERFORMANCE_ROUTES.UNIT_WAFER.path}`;
    default:
      return '/';
  }
};

export const objectToParams = (data = {}) => {
  if (data && Object.keys(data).length) {
    return `&${queryString.stringify(data, { arrayFormat: 'comma' })}`;
  }

  return '';
};

export const updateNextDataURL = (data = '') => {
  if (!data) return '';
  if (process.env.REACT_APP_CONVERT_HTTP_TO_HTTPS === 'true') {
    return data.replace('http', 'https');
  }
  return data;
};

export const getTimeZoneParam = () => {
  return timeZone.replace('/', '-');
};

export const isSameObject = (a, b) => {
  return _.isEqual(a, b);
};

export const formatFloatToXDecimal = (value = 0, decimalPoint = 3) => {
  return value.toFixed(decimalPoint);
};

export const getGTDetectionRegions = ({ fileSetDefects, isNoDefect }) => {
  const { gt_detections = {} } = fileSetDefects;

  const regions = (gt_detections?.detection_regions ?? []).map(item => {
    return { ...item, defects: item.defects };
  });

  const detectionRegions = createDetectionRegions(regions, false, isNoDefect);
  return { ...gt_detections, detection_regions: detectionRegions };
};

export const getAiDetectionRegions = ({ fileSetDefects, isNoDefect }) => {
  const { model_detections = [] } = fileSetDefects;
  const formattedModelDetections = {};

  model_detections.forEach(item => {
    const detectionRegions = createDetectionRegions(
      item.detection_regions,
      true,
      isNoDefect
    );
    formattedModelDetections[item.ml_model.id] = {
      ...item,
      detection_regions: detectionRegions
    };
  });

  return formattedModelDetections;
};

export const transformKeyValuestIntoObject = ({ obj = {}, keyNames = [] }) => {
  let stringifyJSON = JSON.stringify(obj);

  keyNames.forEach(key => {
    const value = toCamel(key);

    stringifyJSON = stringifyJSON.replaceAll(key, value);
  });

  return JSON.parse(stringifyJSON);
};

export const getStackBarChartMeta = (ref, numOfBars) => {
  const stackBarContainer = ref.current;
  const stackBarContainerWidth = stackBarContainer.clientWidth - 28; // Total width - horizontalPadding
  const svgContainer = stackBarContainer.getElementsByTagName('svg')[0];
  if (!svgContainer) return {};

  const svgContainerWidth = svgContainer.clientWidth;
  const svgChildren = svgContainer.getElementsByTagName('g');
  const yAxisArray = [
    ...svgContainer.getElementsByClassName('apexcharts-yaxis')
  ];

  if (!(svgChildren.length && yAxisArray.length)) return {};

  const totalYaxisWidth = yAxisArray.reduce((total, ele) => {
    const { width } = ele.getBoundingClientRect();
    return total + width;
  }, 0);

  const { width: graphWidth } = svgChildren[0].getBoundingClientRect();
  const svgContainerPadding = (svgContainerWidth - graphWidth) * 2;
  const barPlottingArea =
    stackBarContainerWidth - totalYaxisWidth - svgContainerPadding;

  const barWidth = barPlottingArea / numOfBars;
  const chartWidth =
    barWidth < 15
      ? 15 * numOfBars + totalYaxisWidth + svgContainerPadding
      : '100%';

  return {
    width: chartWidth,
    verticalLabel: barWidth < 40,
    hideLabels: barWidth < 15,
    barWidth
  };
};

export const getTenthFactor = number => {
  const powerOfTen = `${number}`.length;
  const maxAbsoluteNumber = Math.pow(10, powerOfTen - 1);
  const maxTenthOrderNum =
    number - (number % maxAbsoluteNumber) + maxAbsoluteNumber;

  return maxTenthOrderNum;
};

const rangeWiseDateFormat = {
  daily: 'DD MMM YY',
  monthly: 'MMM YY',
  weekly: 'DD MMM YY'
};

export const getDateValue = (date, timeRange) => {
  if (timeRange === 'weekly') {
    return `${formatDisplayDate(date, 'DD')}-${formatDisplayDate(
      dayjs(date).add(1, 'week'),
      rangeWiseDateFormat[timeRange]
    )}`;
  }

  return formatDisplayDate(date, rangeWiseDateFormat[timeRange]);
};

export const abbrNum = (number, decPlaces) => {
  // 2 decimal places => 100, 3 => 1000, etc
  decPlaces = Math.pow(10, decPlaces);

  // Enumerate number abbreviations
  var abbrev = ['k', 'm', 'b', 't'];

  // Go through the array backwards, so we do the largest first
  for (var i = abbrev.length - 1; i >= 0; i--) {
    // Convert array index to "1000", "1000000", etc
    var size = Math.pow(10, (i + 1) * 3);

    // If the number is bigger or equal do the abbreviation
    if (size <= number) {
      // Here, we multiply by decPlaces, round, and then divide by decPlaces.
      // This gives us nice rounding to a particular decimal place.
      number = Math.round((number * decPlaces) / size) / decPlaces;

      // Handle special case where we round up to the next abbreviation
      if (number === 1000 && i < abbrev.length - 1) {
        number = 1;
        i++;
      }

      // Add the letter for the abbreviation
      number += abbrev[i];

      // We are done... stop
      break;
    }
  }

  return number;
};

export const getAutoClassificationPercentage = data =>
  getPercentage(data.auto_classified, data.total);

export const getOccurrences = (data, checkFn) => {
  return data.reduce((prev, curr) => {
    if (checkFn(curr)) {
      return prev + 1;
    }
    return prev;
  }, 0);
};

export const formateFileSetFiltersForApi = data => {
  const { file_set_filters, ...rest } = data;

  return {
    file_set_filters: encodeURL(
      getDateFromParams(
        queryString.stringify(file_set_filters, { arrayFormat: 'comma' }),
        undefined,
        true
      )
    ),
    ...rest
  };
};

export const getMinDate = (dateA, dateB) => {
  if (dayjs(dateA).isBefore(dayjs.utc(dateB))) return dateA;
  return dateB;
};

export const getMaxDate = (dateA, dateB) => {
  if (dayjs(dateA).isAfter(dayjs.utc(dateB))) return dateA;
  return dateB;
};

export const getPercentage = (value, total) => {
  return (value * 100) / total;
};

export const formatPercentageValue = (value, noValueString = 'N/A') => {
  if (value || value === 0) {
    return `${value.toFixed(1)}%`;
  }
  return noValueString;
};

export const getAutoClassificationAccuracyBackgroudColor = (
  autoClassification,
  accuracy
) => {
  if (accuracy === null) {
    return COHORT_COLOR_MAPPING_CONSTANT['Uncategorized'];
  }
  if (autoClassification >= 93 && accuracy >= 90) {
    return COHORT_COLOR_MAPPING_CONSTANT['93-100, 90-100'];
  }
  if (autoClassification >= 93 && accuracy < 90) {
    return COHORT_COLOR_MAPPING_CONSTANT['93-100, 0-90'];
  }
  if (autoClassification < 93 && accuracy >= 90) {
    return COHORT_COLOR_MAPPING_CONSTANT['0-93, 90-100'];
  }
  if (autoClassification < 93 && accuracy < 90) {
    return COHORT_COLOR_MAPPING_CONSTANT['0-93, 0-90'];
  }
  return '';
};

export const getAccuracyBackgroundColor = accuracy => {
  if (accuracy === null) {
    return COHORT_COLOR_MAPPING_CONSTANT['Uncategorized'];
  }
  if (accuracy >= 90) {
    return COHORT_COLOR_MAPPING_CONSTANT['90-100'];
  }
  if (accuracy >= 80 && accuracy < 90) {
    return COHORT_COLOR_MAPPING_CONSTANT['80-90'];
  }
  if (accuracy < 80) {
    return COHORT_COLOR_MAPPING_CONSTANT['0-80'];
  }
  return '';
};

export const COHORT_COLOR_MAPPING_CONSTANT = {
  '0-93, 0-90': '#FB7185',
  '0-93, 90-100': '#E8AD6A',
  '93-100, 0-90': '#F2C94C',
  '93-100, 90-100': '#6FCF97',
  '0-80': '#EB5757',
  '80-90': '#F2C94C',
  '90-100': '#6FCF97',
  Uncategorized: 'rgba(251, 113, 133, 0.4)'
};
