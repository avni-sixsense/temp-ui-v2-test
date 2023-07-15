import { convertDataType, handleFileDownload } from 'app/utils';
import {
  encodeString,
  encodeURL,
  formatDateFilter,
  getDateFromParams,
  getParamsFromEncodedString,
  getTimeFormat,
  getTimeZoneParam
} from 'app/utils/helpers';
import dayjs from 'dayjs';
import queryString from 'query-string';
import BACKEND_URL from 'store/constants/urls';

import axios from './base';

const getWaferTagsByName = name =>
  axios
    .get(`/api/v1/classif-ai/wafer-map-tags/?name=${name}`)
    .then(res => res.data);

const markAllLabels = data =>
  axios.post(
    `api/v1/classif-ai/user-classification/copy-ai-annotation-to-user/`,
    data
  );

const getAllWaferTags = (key, ids) =>
  axios
    .get(`/api/v1/classif-ai/wafer-map-tags/${ids ? `?id__in=${ids}` : ''}`)
    .then(res => res.data);

const getAllPaginatedWaferTags = (key, cursor = false, search = '') =>
  axios
    .get(
      `/api/v1/classif-ai/wafer-map-tags/?limit=10${cursor ? '&cursor=' : ''}${
        search ? `&name__icontains=${search}` : ''
      }`
    )
    .then(res => res.data);

const getWaferTagByid = (key, id) =>
  axios.get(`/api/v1/classif-ai/wafer-map-tags/${id}/`).then(res => res.data);

const removeTagsOnWafers = (data, id) =>
  axios.delete(`/api/v1/classif-ai/wafer-map/tags/?wafer_filters=${id}`, {
    data
  });

const getWaferTags = params =>
  axios
    .get(`api/v1/classif-ai/wafer-map/tags/?wafer_filters=${params}`)
    .then(_ => _.data);

const updateTagsOnWafers = (data, id) =>
  axios.put(`/api/v1/classif-ai/wafer-map/tags/?wafer_filters=${id}`, data);

const createNewWaferTag = data =>
  axios.post(`/api/v1/classif-ai/wafer-map-tags/`, data);

const updateTagsOnFilesets = data =>
  axios.put(`/api/v1/classif-ai/file-set/tags/`, data);

const removeTagsOnFilesets = data =>
  axios.delete(`/api/v1/classif-ai/file-set/tags/`, { data });

const getFilesetTags = id =>
  axios.get(`/api/v1/classif-ai/file-set/?id__in=${id}`).then(res => res.data);

const getAllFilesetTags = (key, ids) =>
  axios
    .get(`/api/v1/classif-ai/file-set-tags/${ids ? `?id__in=${ids}` : ''}`)
    .then(res => res.data);

const getAllPaginatedFilesetTags = (key, cursor = false, search = '') =>
  axios
    .get(
      `/api/v1/classif-ai/file-set-tags/?limit=10${cursor ? '&cursor=' : ''}${
        search ? `&name__icontains=${search}` : ''
      }`
    )
    .then(res => res.data);

const getFilesetTagByid = (key, id) =>
  axios.get(`/api/v1/classif-ai/file-set-tags/${id}/`).then(res => res.data);

const createNewFilesetTag = data =>
  axios.post(`/api/v1/classif-ai/file-set-tags/`, data);

const updateTagsonUploadsession = (data, id) =>
  axios.put(
    `/api/v1/classif-ai/upload-session/tags/?upload_session_filters=${id}`,
    data
  );

const removeTagsOnUploadsession = (data, id) =>
  axios.delete(
    `/api/v1/classif-ai/upload-session/tags/?upload_session_filters=${id}`,
    { data }
  );

const getUploadSessionsTags = id =>
  axios
    .get(`/api/v1/classif-ai/upload-session/?id__in=${id}`)
    .then(res => res.data);

const getAllUploadSessionsTags = (key, ids) =>
  axios
    .get(
      `/api/v1/classif-ai/upload-session-tags/${ids ? `?id__in=${ids}` : ''}`
    )
    .then(res => res.data);

const getAllPaginatedUploadSessionsTags = (
  key,
  cursor = false,
  search = ''
) => {
  return axios
    .get(
      `/api/v1/classif-ai/upload-session-tags/?limit=10${
        cursor ? '&cursor=' : ''
      }${search ? `&name__icontains=${search}` : ''}`
    )
    .then(res => res.data);
};

const getUploadsessionTagByid = (key, id) =>
  axios
    .get(`/api/v1/classif-ai/upload-session-tags/${id}/`)
    .then(res => res.data);

const createuploadsessionTag = data =>
  axios.post(`api/v1/classif-ai/upload-session-tags/`, data);

const getPacks = (key, orgId) =>
  axios
    .get(`/api/v1/packs/?sub_organization_id=${orgId}`)
    .then(res => res.data.results);

const getPackById = (key, orgId, id) =>
  axios
    .get(`/api/v1/packs/${id}/?sub_organization_id=${orgId}`)
    .then(res => res.data);

const getSubscriptions = (key, orgId) =>
  axios
    .get(`/api/v1/subscriptions/?sub_organization_id=${orgId}`)
    .then(res => res.data.results);

const uploadFiles = data => axios.post(`/api/v1/classif-ai/file-set/`, data);

const getSessionId = (data, isAutoRename = 'false') =>
  axios.post(
    `/api/v1/classif-ai/upload-session/?auto_rename=${isAutoRename}`,
    data
  );

const getUploadSessions = (
  key,
  limit,
  offset = 0,
  params,
  subscriptionId,
  cursor = false,
  search = ''
) => {
  const decodedParams = getParamsFromEncodedString(
    window.location.search,
    true
  );
  const paramsNew = decodedParams
    .replace('upload_session_id__in', 'id__in')
    .replace('?', '');

  return axios
    .get(
      `/api/v1/classif-ai/upload-session/?subscription_id=${subscriptionId}&limit=${limit}${
        paramsNew ? `&${paramsNew}` : ''
      }${cursor ? '&cursor=' : `&offset=${offset}`}${
        search ? `&files__name__icontains=${search}` : ''
      }`
    )
    .then(_ => _.data);
};

const getUploadSessionsFilters = (
  key,
  limit,
  offset = 0,
  params,
  subscriptionId,
  cursor = false,
  search = ''
) => {
  const decodedParams = params ? getParamsFromEncodedString(params) : null;

  return axios
    .get(
      `/api/v1/classif-ai/upload-session/?subscription_id=${subscriptionId}&limit=${limit}${
        decodedParams ? `&${decodedParams}` : ''
      }${cursor ? '&cursor=' : `&offset=${offset}`}${
        search ? `&name__icontains=${search}` : ''
      }`
    )
    .then(_ => _.data);
};
const getUploadSessionsByIds = (key, subscriptionId, ids) => {
  return axios
    .get(
      `/api/v1/classif-ai/upload-session/?subscription_id=${subscriptionId}${
        ids ? `&id__in=${ids}` : ''
      }`
    )
    .then(_ => _.data);
};

const getFileSets = (
  key,
  limit,
  offset,
  subscriptionId,
  params,
  manuallySelectedModelId,
  convertDateToCreatedTs = true
) => {
  let decodedParams = getParamsFromEncodedString(
    params,
    convertDateToCreatedTs,
    ['allWafersId']
  );

  if (decodedParams.includes('ai_predicted_label__in')) {
    if (manuallySelectedModelId) {
      decodedParams = decodedParams.concat(
        `&ml_model_id__in=${manuallySelectedModelId}`
      );
    } else if (!decodedParams.includes('ml_model_id__in')) {
      decodedParams = decodedParams.concat(`&model_selection=latest`);
    }
  }

  return axios
    .get(
      `/api/v1/classif-ai/file-set/?subscription_id=${subscriptionId}&${
        decodedParams.length ? `${decodedParams}` : ''
      }${limit ? `&limit=${limit}` : ''}${
        offset || offset === 0 ? `&offset=${offset}` : ''
      }`
    )
    .then(_ => _.data);
};

const getFilters = (data, params, filterIds) => {
  const { date__gte, date__lte } = getDateFromParams(
    window.location.search,
    'YYYY-MM-DD'
  );

  return axios
    .get(
      `/api/v1/classif-ai/file-set-meta-info/${data}/distinct?date__gte=${date__gte}-00-00-00&date__lte=${date__lte}-23-59-59`
    )
    .then(_ => {
      const { data } = _.data;

      if (filterIds) {
        filterIds = (Array.isArray(filterIds) ? filterIds : [filterIds]).map(
          d => d.toString()
        );

        return {
          results: data
            .filter(item => filterIds.includes(item))
            .map(item => ({
              id: convertDataType(item),
              name: item,
              value: convertDataType(item)
            })),
          next: null,
          prev: null
        };
      }

      return {
        results: data
          .filter(item => item)
          .map(item => ({
            id: convertDataType(item),
            name: item,
            value: convertDataType(item)
          })),
        next: null,
        prev: null
      };
    });
};

const getDefectImage = (key, subscriptionId, params) => {
  const parsedParams = queryString.parse(params, {
    arrayFormat: 'comma',
    parseNumbers: true
  });
  delete parsedParams.train_type__in;
  delete parsedParams.is_Bookmarked;
  const newParams = queryString.stringify(parsedParams, {
    arrayFormat: 'comma'
  });
  return axios.get(
    `/api/v1/classif-ai/application-charts/heatmap/?subscription_id=${subscriptionId}${
      newParams.length ? `&${newParams}` : ''
    }`
  );
};

const getPaginatedModels = (key, id, limit, offset, params) => {
  const decodedParams = getParamsFromEncodedString(window.location.search);
  return axios
    .get(
      `/api/v1/classif-ai/ml-model/?subscription_id=${id}&limit=${limit}&offset=${offset}${
        decodedParams.length
          ? `&${decodedParams.replace('ml_model_id__in', 'id__in')}`
          : ''
      }`
    )
    .then(_ => _.data);
};

const getMlModels = (key, id, filter = true, ids, params = '') => {
  return axios
    .get(
      `/api/v1/classif-ai/ml-model/?subscription_id=${id}${
        ids ? `&id__in=${ids}` : '&get_all_records=true'
      }${params}${
        filter ? '&status__in=deployed_in_prod,ready_for_deployment' : ''
      }`
    )
    .then(_ => {
      return _.data;
    });
};

const getPaginatedMlModels = (
  key,
  id,
  filter = true,
  cursor = false,
  search = '',
  params = ''
) =>
  axios
    .get(
      `/api/v1/classif-ai/ml-model/?subscription_id=${id}&limit=10${
        cursor ? '&cursor=' : '&offset=0'
      }${search ? `&name__icontains=${search}` : ''}${params}${
        filter ? '&status__in=deployed_in_prod,ready_for_deployment' : ''
      }`
    )
    .then(_ => {
      return _.data;
    });

const getWaferMap = (key, ids, getAllData = false) =>
  axios
    .get(
      `/api/v1/classif-ai/wafer-map/?${ids ? `id__in=${ids}` : ''}${
        getAllData ? `${ids ? '&' : ''}get_all_records=true` : ''
      }`
    )
    .then(_ => {
      return _.data;
    });

const getPaginateWaferMap = (key, cursor = false, search = '', params = '') => {
  const decodedParams = getParamsFromEncodedString(params);

  return axios
    .get(
      `/api/v1/classif-ai/wafer-map/?limit=10${
        cursor ? '&cursor=' : '&offset=0'
      }${
        search ? `&organization_wafer_id__icontains=${search}` : ''
      }&${decodedParams}`
    )
    .then(_ => {
      return _.data;
    });
};

const getMlModelByid = id =>
  axios.get(`/api/v1/classif-ai/ml-model/${id}/`).then(_ => {
    return _.data;
  });

const getMlModelWeightedDefects = id =>
  axios
    .get(`/api/v1/classif-ai/ml-model-defects/?ml_model=${id}&weighted=true`)
    .then(_ => {
      return _.data;
    });

const updateMlModelWeightedDefects = (modelId, defectId, data) =>
  axios.patch(
    `/api/v1/classif-ai/ml-model-defects/bulk_update/?ml_model=${modelId}&defect=${defectId}`,
    data
  );

const getSimilarityVsPerformanceCSV = id =>
  axios
    .get(
      `/api/v1/classif-ai/ml-model/${id}/similarity_performance/?export=true`
    )
    .then(_ => {
      return _.data;
    });

const getBaseMlModel = (key, usecaseType = '') => {
  return axios
    .get(
      `/api/v1/classif-ai/base-ml-model?get_all_records=true&type=${
        usecaseType ? usecaseType : ''
      }`
    )
    .then(res => {
      return res.data;
    });
};

const getBaseMlModelById = id =>
  axios.get(`/api/v1/classif-ai/base-ml-model/${id}`).then(res => {
    return res.data;
  });

const fileSetInferenceQueue = data =>
  axios.post('/api/v1/classif-ai/file-set-inference-queue/', data);

const getFileSetLabels = (key, id) =>
  axios
    .get(`/api/v1/classif-ai/file-set-label?file_set_id=${id}`)
    .then(_ => _.data);

const getRegions = (key, model, file) =>
  axios
    .get(`/api/v1/classif-ai/file-region/?file_id=${file}&ml_model_id=${model}`)
    .then(_ => _.data);

const getDefects = (
  key,
  subscriptionId,
  cursor = false,
  search = '',
  params = ''
) =>
  axios
    .get(
      `/api/v1/classif-ai/defects/?subscription_id__in=${subscriptionId}&limit=10${
        cursor ? '&cursor=' : '&get_all_records=true&offset=0'
      }${search ? `&name__icontains=${search}` : ''}${params}`
    )
    .then(_ => _.data);

const getDefectsByIds = (key, subscriptionId, ids) =>
  axios
    .get(
      `/api/v1/classif-ai/defects/?subscription_id__in=${subscriptionId}&get_all_records=true${
        ids ? `&id__in=${ids}` : ''
      }`
    )
    .then(_ => _.data);

const getInferenceStatus = (key, model, fileSet) =>
  axios
    .get(
      `/api/v1/classif-ai/file-set-inference-queue/?file_set_id=${fileSet}&ml_model_id=${model}`
    )
    .then(_ => _.data);

const getAutoModel = (key, fileSet) =>
  axios
    .get(`/api/v1/classif-ai/file-set/${fileSet}/last_deployed_model/`)
    .then(_ => _.data);

const addFileRegion = data =>
  axios.post('/api/v1/classif-ai/file-region/', data);

const updateFileRegion = (data, regionId) =>
  axios.patch(`/api/v1/classif-ai/file-region/${regionId}/`, data);

const markNoDefect = data =>
  axios.post(`/api/v1/classif-ai/file-region/mark_no_defect/`, data);

const getAllUploadSessions = () =>
  axios
    .get(`/api/v1/classif-ai/upload-session/?limit=1000&offset=0`)
    .then(_ => _.data.results);

const getUserInfo = () => axios.get('/api/v1/users/me/').then(_ => _.data);

const logout = () => axios.post('/api/v1/users/logout/').then(_ => _.data);

const getAllUsers = () => axios.get(`/api/v1/users/`).then(_ => _.data);

const getFileSet = (key, fileSetId) =>
  axios.get(`/api/v1/classif-ai/file-set/${fileSetId}/`);

const performaceSummary = (key, subscriptionId, params, modelId) => {
  const parsedParams = queryString.parse(params, {
    arrayFormat: 'comma',
    parseNumbers: true
  });
  delete parsedParams.ml_model_id__in;
  delete parsedParams.is_Bookmarked;
  delete parsedParams.time_format;
  const newParams = queryString.stringify(parsedParams, {
    arrayFormat: 'comma'
  });
  return axios.get(
    `/api/v1/classif-ai/data-performance-summary?records_with_feedback=true&subscription_id=${subscriptionId}${
      modelId ? `&ml_model_id__in=${modelId}` : ''
    }${newParams ? `&${newParams}` : ''}`
  );
};

const dashboardPerformaceSummary = (
  key,
  subscriptionId,
  params,
  recordsWithFeedback
) => {
  const parsedParams = queryString.parse(params, {
    arrayFormat: 'comma',
    parseNumbers: true
  });
  delete parsedParams.ml_model_id__in;
  delete parsedParams.is_Bookmarked;
  delete parsedParams.time_format;
  const newParams = queryString.stringify(parsedParams, {
    arrayFormat: 'comma'
  });
  return axios.get(
    `/api/v1/classif-ai/data-performance-summary?subscription_id=${subscriptionId}&records_with_feedback=${recordsWithFeedback}${
      newParams ? `&${newParams}` : ''
    }`
  );
};

const createTrainingSession = data => {
  return axios
    .post(`/api/v1/classif-ai/training-session/`, data)
    .then(_ => _.data);
};

const tainingSessionFileSets = data =>
  axios.post(`/api/v1/classif-ai/training-session-file-sets`, data);

const getDetailedReport = (key, model, params) => {
  const parsedParams = queryString.parse(params, {
    arrayFormat: 'comma',
    parseNumbers: true
  });
  delete parsedParams.ml_model_id__in;
  delete parsedParams.is_Bookmarked;
  const newParams = queryString.stringify(parsedParams, {
    arrayFormat: 'comma'
  });
  return axios.get(
    `/api/v1/classif-ai/detailed-report?ml_model_id__in=${model}${
      newParams.length ? `&${newParams}` : ''
    }`
  );
};

const getClasswiseMatrix = (key, model, params) => {
  const parsedParams = queryString.parse(params, {
    arrayFormat: 'comma',
    parseNumbers: true
  });
  delete parsedParams.ml_model_id__in;
  delete parsedParams.is_Bookmarked;
  const newParams = queryString.stringify(parsedParams, {
    arrayFormat: 'comma'
  });
  return axios.get(
    `/api/v1/classif-ai/class-wise-matrix?ml_model_id__in=${model}${
      newParams.length ? `&${newParams}` : ''
    }`
  );
};

const uploadMetaInfo = postdata =>
  axios.patch(`/api/v1/classif-ai/upload-meta-info`, postdata);

const applicationCharts = (
  key,
  subscriptionId,
  params,
  timeFormat,
  selectedDefects
) => {
  const parsedParams = queryString.parse(params, {
    arrayFormat: 'comma',
    parseNumbers: true
  });
  delete parsedParams.train_type__in;
  delete parsedParams.is_Bookmarked;
  delete parsedParams.time_format;
  if (
    BACKEND_URL.includes('infineon') ||
    process.env.REACT_APP_CUSTOMER === 'infineon'
  ) {
    parsedParams.priority = true;
  }
  const defectIds = selectedDefects
    ?.filter(defect => defect.id)
    .map(defect => defect.id);
  const newParams = queryString.stringify(parsedParams, {
    arrayFormat: 'comma'
  });
  return axios.get(
    `/api/v1/classif-ai/application-charts?subscription_id=${subscriptionId}&time_format=${timeFormat}${
      newParams.length ? `&${newParams}` : ''
    }${
      defectIds?.length > 0
        ? `&insignificant_defect_ids=${defectIds.join(',')}`
        : ''
    }`
  );
};

const useCase = (
  key,
  limit,
  offset,
  subscriptionID,
  params = '',
  allRecords = false,
  cursor = false,
  search = ''
) => {
  const decodedParams = getParamsFromEncodedString(params);
  return axios
    .get(
      `/api/v1/classif-ai/use-case/?subscription_id=${subscriptionID}${
        limit ? `&limit=${limit}` : ''
      }${
        (offset && offset !== undefined) || offset === 0
          ? `&offset=${offset}`
          : ''
      }${
        decodedParams.length
          ? `&${decodedParams.replace('use_case_id__in', 'id__in')}`
          : ''
      }${allRecords ? '&get_all_records=true' : ''}${cursor ? '&cursor=' : ''}${
        search ? `&name__icontains=${search}` : ''
      }`
    )
    .then(_ => _.data);
};

const useCaseByIds = (
  key,
  limit,
  offset,
  subscriptionID,
  params = '',
  allRecords = false,
  ids
) => {
  const decodedParams = getParamsFromEncodedString(params);
  return axios
    .get(
      `/api/v1/classif-ai/use-case/?subscription_id=${subscriptionID}${
        limit ? `&limit=${limit}` : ''
      }${
        (offset && offset !== undefined) || offset === 0
          ? `&offset=${offset}`
          : ''
      }${
        decodedParams.length
          ? `&${decodedParams.replace('use_case_id__in', 'id__in')}`
          : ''
      }${allRecords ? '&get_all_records=true' : ''}${
        ids ? `&id__in=${ids}` : ''
      }`
    )
    .then(_ => _.data);
};

const predictionCsv = (sessions, model) =>
  axios.get(
    `/api/v1/classif-ai/prediction-csv?upload_session_id__in=${sessions}&ml_model_id__in=${model}`
  );

const getDistinctUploadSessions = (
  key,
  subscriptionId,
  date,
  cursor = false,
  search = ''
) => {
  let formatted;

  if (date) {
    formatted = formatDateFilter(date);
  }

  return axios
    .get(
      `/api/v1/classif-ai/upload-session/distinct/?subscription_id=${subscriptionId}${
        formatted
          ? `&created_ts_after=${formatted.start}-00-00-00&created_ts_before=${formatted.end}-23-59-59`
          : ''
      }&limit=10${cursor ? '&cursor=' : '&offset=0'}${
        search ? `&files__name__icontains=${search}` : ''
      }`
    )
    .then(_ => _.data.data);
};

const getTrainingData = (key, subscriptionId, limit, offset, params, model) => {
  if (params.includes('date') || params.includes('ml_model_id__in')) {
    params = queryString.parse(params);
    delete params.date__gte;
    delete params.date__lte;
    delete params.ml_model_id__in;
    params = queryString.stringify(params);
  }
  return axios
    .get(
      `/api/v1/classif-ai/file-set/defects/?use_case_id__in=${
        model.use_case
      }&subscription_id=${subscriptionId}&limit=${limit}&offset=${offset}${
        params.length ? `&${params}` : ''
      }`
    )
    .then(_ => _.data);
};

const pollTrainingSession = (key, id) =>
  axios.get(`api/v1/classif-ai/training-session/${id}/`).then(_ => _.data);

const accuracyTrend = (key, subscriptionId, modelsId, params, timeFormat) => {
  const parsedParams = queryString.parse(params, {
    arrayFormat: 'comma',
    parseNumbers: true
  });
  delete parsedParams.ml_model_id__in;
  delete parsedParams.is_Bookmarked;
  const newParams = queryString.stringify(parsedParams, {
    arrayFormat: 'comma'
  });
  return axios
    .get(
      `/api/v1/classif-ai/data-performance-summary/accuracy_trend/?subscription_id=${subscriptionId}&ml_model_id__in=${modelsId}${
        newParams.length ? `&${newParams}` : ''
      }&time_format=${timeFormat}`
    )
    .then(_ => _.data);
};

const overkillTrend = (
  key,
  subscriptionId,
  params,
  timeFormat,
  selectedDefects
) => {
  const parsedParams = queryString.parse(params, {
    arrayFormat: 'comma',
    parseNumbers: true
  });
  delete parsedParams.train_type__in;
  delete parsedParams.is_Bookmarked;
  delete parsedParams.time_format;
  const defectIds = selectedDefects
    ?.filter(defect => defect.id)
    .map(defect => defect.id);
  const newParams = queryString.stringify(parsedParams, {
    arrayFormat: 'comma'
  });
  return axios.get(
    `/api/v1/classif-ai/application-charts/overkill_trend/?subscription_id=${subscriptionId}${
      newParams.length ? `&${newParams}` : ''
    }&time_format=${timeFormat}${
      defectIds?.length > 0
        ? `&insignificant_defect_ids=${defectIds.join(',')}`
        : ''
    }`
  );
};

const getSubscription = id =>
  axios
    .get(`/api/v1/subscriptions/${id}/?sub_organization_id=1`)
    .then(_ => _.data);

const getOverkillDefects = (key, id) =>
  axios.get(`/api/v1/subscriptions/${id}/`).then(_ => _.data);

const uploadModel = data => axios.post('/api/v1/classif-ai/ml-model/', data);

const updateModelById = (id, data) =>
  axios.patch(`/api/v1/classif-ai/ml-model/${id}/`, data);

const checkModelName = name =>
  axios.get(`/api/v1/classif-ai/ml-model/?name=${name}`);

const aiResultsCsv = (params, subscriptionId) =>
  axios.get(
    `/api/v1/classif-ai/ai-results-csv?subscription_id=${subscriptionId}${
      params.length ? `&${params}` : ''
    }`
  );

const createEditDefect = data =>
  axios.post(`/api/v1/classif-ai/defects/`, data);

const updateDefect = (data, id) =>
  axios.patch(`/api/v1/classif-ai/defects/${id}/`, data);

const useCaseDefects = data =>
  axios.post(`/api/v1/classif-ai/use-case-defects/`, data);

const updateUseCaseDefects = (data, id) =>
  axios.patch(`/api/v1/classif-ai/use-case-defects/${id}/`, data);

const deleteUseCase = id =>
  axios.delete(`/api/v1/classif-ai/use-case-defects/${id}/`);

const useCaseMetaInfo = (id, data) =>
  axios.post(`/api/v1/classif-ai/defects/${id}/meta_info/`, data);

const getUseCaseMetaInfo = (key, id) =>
  axios.get(`/api/v1/classif-ai/defects/${id}/meta_info/`).then(_ => _.data);

const deleteUseCaseMetaInfo = id =>
  axios.delete(`/api/v1/classif-ai/defect-meta-info/${id}/`);

const updateUseCaseMetaInfo = (data, id) =>
  axios.patch(`/api/v1/classif-ai/defect-meta-info/${id}/`, data);

const getDefect = (key, id) =>
  axios
    .get(`/api/v1/classif-ai/defects/${id}/?get_all_records=true`)
    .then(_ => _.data);

const defectDetails = (key, limit, offset, subscriptionId, params) =>
  axios
    .get(
      `/api/v1/classif-ai/defects/detailed/?limit=${limit}&offset=${offset}&subscription_id__in=${subscriptionId}${
        params.length ? `&${params.replace('defect_id__in', 'id__in')}` : ''
      }`
    )
    .then(_ => _.data);

const getUseCaseDefects = (key, useCaseId, subscriptionId) =>
  axios
    .get(
      `/api/v1/classif-ai/defects/?subscription_id=${subscriptionId}&use_case_id__in=${useCaseId}&get_all_records=true`
    )
    .then(_ => _.data);

const getModelDefects = (key, modelId, isAdded) =>
  axios
    .get(
      `/api/v1/classif-ai/defects/?${
        isAdded
          ? `ml_model_id__in=${modelId}`
          : `ml_model_id__not_in=${modelId}`
      }&get_all_records=true`
    )
    .then(_ => _.data);

const getUseCaseDetails = (key, key1, id, useCaseId) =>
  axios
    .get(
      `/api/v1/classif-ai/ml-model?subscription_id=${id}&use_case_id__in=${useCaseId}`
    )
    .then(_ => _.data);

const confusionMatrix = (key, params) => {
  const decodedParams = getParamsFromEncodedString(params);
  const parsedParams = queryString.parse(decodedParams, {
    arrayFormat: 'comma',
    parseNumbers: true
  });
  delete parsedParams.is_Bookmarked;
  delete parsedParams.packId;
  delete parsedParams.time_format;
  const newParams = queryString.stringify(parsedParams, {
    arrayFormat: 'comma'
  });
  return axios
    .get(
      `/api/v1/classif-ai/classification/metrics/confusion_matrix/?${newParams}`
    )
    .then(_ => _.data);
};

const deleteFileSet = fileSetId =>
  axios.delete(`/api/v1/classif-ai/file-set/${fileSetId}/`);

const login = data => axios.post('/api/v1/users/login/', data);

const deleteDefect = id => axios.delete(`/api/v1/classif-ai/defects/${id}/`);

const leadLevelCsv = (params, subscriptionId) =>
  axios.get(
    `/api/v1/classif-ai/application-charts/lead_level_csv/?subscription_id=${subscriptionId}${
      params.length ? `&${params}` : ''
    }`
  );

const bulkCreateFileSetInferenceQueue = data =>
  axios.post(
    `/api/v1/classif-ai/file-set-inference-queue/batch_inference/`,
    data
  );

const fileSetInferenceQueueProgressStatus = (
  key,
  params,
  modelIds,
  filesetIds,
  isFolderView = true
) => {
  const decodedParams = getParamsFromEncodedString(window.location.search);
  const tempParams = queryString.parse(decodedParams, {
    arrayFormat: 'comma',
    parseNumbers: true
  });

  delete tempParams.time_format;
  tempParams.ml_model_id__in = modelIds;

  if (filesetIds.length) {
    delete tempParams.upload_session_id__in;
  }
  // else {
  // 	tempParams.upload_session_id = tempParams.upload_session_id__in
  // 	delete tempParams.upload_session_id__in
  // }
  if (isFolderView) {
    tempParams.upload_session_id__in = filesetIds;
  } else {
    tempParams.file_set_id__in = filesetIds;
  }
  const stringifyParams = queryString.stringify(tempParams, {
    arrayFormat: 'comma'
  });
  return axios
    .get(
      `/api/v1/classif-ai/file-set-inference-queue/progress_status/?${stringifyParams}`
    )
    .then(_ => _.data);
};
const deleteUploadSession = id =>
  axios.delete(`/api/v1/classif-ai/upload-session/${id}/`);

const deleteModel = (id, subscriptionId) =>
  axios.delete(
    `/api/v1/classif-ai/ml-model/${id}/?subscription_id=${subscriptionId}`
  );

const relatedDefects = (key, subscriptionId, params) =>
  axios.get(
    `/api/v1/classif-ai/file-set/related_defects/?subscription_id=${subscriptionId}${
      params.length ? `&${params}` : ''
    }`
  );

const createUseCase = data => axios.post(`/api/v1/classif-ai/use-case/`, data);

const updateUseCase = (data, id) =>
  axios.patch(`/api/v1/classif-ai/use-case/${id}/`, data);

const deployModel = (id, confidence_threshold) =>
  axios.patch(`/api/v1/classif-ai/ml-model/${id}/deploy/`, {
    confidence_threshold
  });

const bookmarkFileSet = (fileSetId, payload) =>
  axios.patch(`/api/v1/classif-ai/file-set/${fileSetId}/`, payload);

const bookmarkFolders = (id, payload) =>
  axios.patch(`/api/v1/classif-ai/upload-session/${id}/`, payload);

const bulkFeedback = data =>
  axios.post('/api/v1/classif-ai/file-region/update_feedback/', data);

const stitchImages = sessionId =>
  axios.post(`/api/v1/classif-ai/upload-session/${sessionId}/stitch_images/`);

const packDetails = id =>
  axios.get(`/api/v1/packs/${id}/?sub_organization_id=1`).then(res => res.data);

const terminateModelProgress = id =>
  axios.post(`/api/v1/classif-ai/training-session/${id}/terminate/`);

const distinctUseCaseForFileSets = params =>
  axios.get(
    `api/v1/classif-ai/file-set/use_cases/?upload_session_id__in=${params}`
  );

const updateOverkillDefect = (id, data) =>
  axios.patch(`api/v1/subscriptions/${id}/`, data);

const getUserClassification = (key, fileId) =>
  axios
    .get(`/api/v1/classif-ai/user-classification/?file=${fileId}`)
    .then(_ => _.data);

const addUserClassification = data =>
  axios.post(`/api/v2/classif-ai/gt-classification/`, data);

const updateUserClassification = (userClassificationId, data) =>
  axios.put(
    `/api/v2/classif-ai/gt-classification/${userClassificationId}/`,
    data
  );

const deleteGTClassification = userClassificationId =>
  axios.delete(`/api/v2/classif-ai/gt-classification/${userClassificationId}/`);

const getUserClassificationById = (key, id) =>
  axios.get(`/api/v1/classif-ai/user-classification/${id}`);

const getUserDetection = (key, fileId) =>
  axios
    .get(`/api/v1/classif-ai/user-detection/?file=${fileId}`)
    .then(_ => _.data);

const addUserDetection = data =>
  axios.post(`api/v2/classif-ai/gt-detection/`, data);

const updateUserDetection = (id, data) =>
  axios.put(`api/v2/classif-ai/gt-detection/${id}/`, data);

const deleteUserDetection = id =>
  axios.delete(`/api/v2/classif-ai/gt-detection/${id}/`);

const getModelClassification = (key, fileId, mlModelId) =>
  axios
    .get(
      `/api/v1/classif-ai/ml-model-classification?file=${fileId}&ml_model=${mlModelId}`
    )
    .then(_ => _.data);

const getModelDetection = (key, fileId, mlModelId) =>
  axios
    .get(
      `/api/v1/classif-ai/ml-model-detection?file=${fileId}&ml_model=${mlModelId}`
    )
    .then(_ => _.data);

const getautoClassificationDefectLevel = (key, params) => {
  delete params.packId;
  if (!params.time_format) {
    params.time_format = getTimeFormat(
      dayjs(params.date__gte, 'YYYY-MM-DD-HH-mm-ss').toDate(),
      dayjs(params.date__lte, 'YYYY-MM-DD-HH-mm-ss').toDate()
    );
  }
  const stringifyParams = queryString.stringify(params, {
    arrayFormat: 'comma'
  });
  return axios
    .get(
      `/api/v1/classif-ai/classification/metrics/auto_classification/file_level/?${stringifyParams}`
    )
    .then(_ => _.data);
};

const getautoClassificationTimeSeries = (key, groupBy) => {
  const decodedParams = getParamsFromEncodedString(
    window.location.search,
    true
  );
  const parsedParams = queryString.parse(decodedParams, {
    arrayFormat: 'comma',
    parseNumbers: true
  });

  if (!parsedParams.time_format) {
    parsedParams.time_format = getTimeFormat(
      dayjs(parsedParams.date__gte, 'YYYY-MM-DD-HH-mm-ss').toDate(),
      dayjs(parsedParams.date__lte, 'YYYY-MM-DD-HH-mm-ss').toDate()
    );
  }
  if (groupBy) {
    parsedParams.time_format = groupBy;
  }
  const stringifyParams = encodeURL(parsedParams);
  return axios
    .get(
      `/api/v2/classif-ai/daily-operations/automation/timeseries-metrics/?file_set_filters=${stringifyParams}&timezone=${getTimeZoneParam()}`
    )
    .then(_ => _.data);
};
const waferGetautoClassificationTimeSeries = (key, params, groupBy) => {
  const decodedParams = getParamsFromEncodedString(
    window.location.search,
    true
  );
  const parsedParams = queryString.parse(decodedParams, {
    arrayFormat: 'comma',
    parseNumbers: true
  });

  if (!parsedParams.time_format) {
    parsedParams.time_format = getTimeFormat(
      dayjs(parsedParams.date__gte, 'YYYY-MM-DD-HH-mm-ss').toDate(),
      dayjs(parsedParams.date__lte, 'YYYY-MM-DD-HH-mm-ss').toDate()
    );
  }
  if (groupBy) {
    parsedParams.time_format = groupBy;
  }
  const stringifyParams = queryString.stringify(parsedParams, {
    arrayFormat: 'comma'
  });
  return axios
    .get(
      `/api/v1/classif-ai/wafer-map/metrics/?group_by=effective_date&order_by=effective_date&${stringifyParams}&timezone=${getTimeZoneParam()}
			`
    )
    .then(_ => _.data);
};
const getaccuracyDefectLevelTimeSeries = (key, params) => {
  delete params.packId;
  if (!params.time_format) {
    params.time_format = getTimeFormat(
      dayjs(params.date__gte, 'YYYY-MM-DD-HH-mm-ss').toDate(),
      dayjs(params.date__lte, 'YYYY-MM-DD-HH-mm-ss').toDate()
    );
  }
  const stringifyParams = queryString.stringify(params, {
    arrayFormat: 'comma'
  });
  return axios
    .get(
      `/api/v1/classif-ai/classification/metrics/accuracy/defect_level_timeseries/?${stringifyParams}`
    )
    .then(_ => _.data);
};

const getaccuracyDefectLevel = (key, params) => {
  delete params.packId;
  if (!params.time_format) {
    params.time_format = getTimeFormat(
      dayjs(params.date__gte, 'YYYY-MM-DD-HH-mm-ss').toDate(),
      dayjs(params.date__lte, 'YYYY-MM-DD-HH-mm-ss').toDate()
    );
  }
  const stringifyParams = queryString.stringify(params, {
    arrayFormat: 'comma'
  });
  return axios
    .get(
      `/api/v1/classif-ai/classification/metrics/accuracy/defect_level/?${stringifyParams}`
    )
    .then(_ => _.data);
};

const getautoClassificationWaferLevel = (key, params) => {
  delete params.packId;
  if (!params.time_format) {
    params.time_format = getTimeFormat(
      dayjs(params.date__gte, 'YYYY-MM-DD-HH-mm-ss').toDate(),
      dayjs(params.date__lte, 'YYYY-MM-DD-HH-mm-ss').toDate()
    );
  }
  const stringifyParams = queryString.stringify(params, {
    arrayFormat: 'comma'
  });
  return axios
    .get(
      `/api/v1/classif-ai/classification/metrics/auto_classification/wafer_level/?${stringifyParams}`
    )
    .then(_ => _.data);
};

const getautoClassificationWaferLevelTimeSeries = (key, params) => {
  delete params.packId;
  if (!params.time_format) {
    params.time_format = getTimeFormat(
      dayjs(params.date__gte, 'YYYY-MM-DD-HH-mm-ss').toDate(),
      dayjs(params.date__lte, 'YYYY-MM-DD-HH-mm-ss').toDate()
    );
  }
  const stringifyParams = queryString.stringify(params, {
    arrayFormat: 'comma'
  });
  return axios
    .get(
      `/api/v1/classif-ai/classification/metrics/auto_classification/wafer_level_timeseries/?${stringifyParams}`
    )
    .then(_ => _.data);
};

const getaccuracyWaferLevelTimeSeries = (key, params) => {
  delete params.packId;
  if (!params.time_format) {
    params.time_format = getTimeFormat(
      dayjs(params.date__gte, 'YYYY-MM-DD-HH-mm-ss').toDate(),
      dayjs(params.date__lte, 'YYYY-MM-DD-HH-mm-ss').toDate()
    );
  }
  const stringifyParams = queryString.stringify(params, {
    arrayFormat: 'comma'
  });
  return axios
    .get(
      `/api/v1/classif-ai/classification/metrics/accuracy/wafer_level_timeseries/?${stringifyParams}`
    )
    .then(_ => _.data);
};

const getaccuracyWaferLevel = (key, params) => {
  delete params.packId;
  if (!params.time_format) {
    params.time_format = getTimeFormat(
      dayjs(params.date__gte, 'YYYY-MM-DD-HH-mm-ss').toDate(),
      dayjs(params.date__lte, 'YYYY-MM-DD-HH-mm-ss').toDate()
    );
  }
  const stringifyParams = queryString.stringify(params, {
    arrayFormat: 'comma'
  });
  return axios
    .get(
      `/api/v1/classif-ai/classification/metrics/accuracy/wafer_level/?${stringifyParams}`
    )
    .then(_ => _.data);
};

const missclassificationDefect = (key, params) => {
  const decodedParams = getParamsFromEncodedString(params);
  const tempParamsObj = queryString.parse(decodedParams, {
    arrayFormat: 'comma',
    parseNumbers: true
  });
  delete tempParamsObj.packId;
  delete tempParamsObj.time_format;
  if (!tempParamsObj.time_format) {
    tempParamsObj.time_format = getTimeFormat(
      dayjs(tempParamsObj.date__gte, 'YYYY-MM-DD-HH-mm-ss').toDate(),
      dayjs(tempParamsObj.date__lte, 'YYYY-MM-DD-HH-mm-ss').toDate()
    );
  }
  const paramsString = queryString.stringify(tempParamsObj, {
    arrayFormat: 'comma'
  });
  return axios
    .get(
      `/api/v1/classif-ai/classification/metrics/missclassification/defect_level/?${
        paramsString ? `${paramsString}` : ''
      }`
    )
    .then(_ => _.data);
};

const defectLevelMatrics = (key, params) => {
  const tempParamsObj = queryString.parse(params, {
    arrayFormat: 'comma',
    parseNumbers: true
  });
  delete tempParamsObj.packId;

  const paramsString = queryString.stringify(tempParamsObj, {
    arrayFormat: 'comma'
  });

  return axios
    .get(
      `/api/v1/classif-ai/classification/metrics/classwise/defect_level/?${
        paramsString ? `${paramsString}` : ''
      }`
    )
    .then(_ => _.data);
};

const useCaseLevelMatrics = (key, params) => {
  const tempParamsObj = queryString.parse(params, {
    arrayFormat: 'comma',
    parseNumbers: true
  });
  delete tempParamsObj.packId;

  const paramsString = queryString.stringify(tempParamsObj, {
    arrayFormat: 'comma'
  });

  return axios
    .get(
      `/api/v1/classif-ai/classification/metrics/classwise/use_case_level/?${
        paramsString ? `${paramsString}` : ''
      }`
    )
    .then(_ => _.data);
};

const addBulkClassification = (data, isAsync = false) => {
  const bulkCreate = isAsync ? `async_bulk_create` : `bulk_create`;
  return axios
    .post(`/api/v1/classif-ai/user-classification/${bulkCreate}/`, data)
    .then(_ => _.data);
};

const replaceBulkClassification = (data, isAsync = false) => {
  const bulkReplace = isAsync ? `async_bulk_replace` : `bulk_replace`;
  return axios
    .post(`/api/v1/classif-ai/user-classification/${bulkReplace}/`, data)
    .then(_ => _.data);
};

const deleteBulkClassification = (data, isAsync = false) => {
  const bulkRemove = isAsync ? `async_bulk_remove` : `bulk_remove`;
  return axios
    .post(`/api/v1/classif-ai/user-classification/${bulkRemove}/`, data)
    .then(_ => _.data);
};

const markOperatorBulkGTClassification = (data, isAsync = false) => {
  const bulkOperatorGT = isAsync
    ? `async-copy-classifications-for-admin`
    : `copy-classifications-for-admin`;
  return axios
    .post(`/api/v1/classif-ai/user-classification/${bulkOperatorGT}/`, data)
    .then(_ => _.data);
};

const deleteBulkDetection = data =>
  axios
    .post(`/api/v1/classif-ai/user-detection/bulk_remove/`, data)
    .then(_ => _.data);

const replaceBulkDetection = data =>
  axios
    .post(`/api/v1/classif-ai/user-detection/bulk_replace/`, data)
    .then(_ => _.data);

const overAllData = (key, params, is24x7 = true, unit, status = '') => {
  const decodedParams = getParamsFromEncodedString(window.location.search);

  const tempParamsObj = queryString.parse(decodedParams, {
    arrayFormat: 'comma',
    parseNumbers: true
  });

  const paramsString = queryString.stringify(tempParamsObj, {
    arrayFormat: 'comma'
  });

  return axios
    .get(
      `/api/v1/classif-ai/classification/metrics/${
        is24x7 ? 'auto_classification' : 'accuracy'
      }/?${paramsString ? `${paramsString}` : ''}${
        unit ? `&unit=${unit}` : ''
      }${status}`
    )
    .then(_ => _.data);
};

const WaferOverAllData = () => {
  const decodedParams = getParamsFromEncodedString(
    window.location.search,
    true
  );

  const tempParamsObj = queryString.parse(decodedParams, {
    arrayFormat: 'comma',
    parseNumbers: true
  });

  const paramsString = queryString.stringify(tempParamsObj, {
    arrayFormat: 'comma'
  });

  return axios
    .get(
      `/api/v1/classif-ai/wafer-map/metrics/?${
        paramsString ? `${paramsString}` : ''
      }`
    )
    .then(_ => _.data);
};
const autoClassificationCohort = key => {
  const decodedParams = getParamsFromEncodedString(
    window.location.search,
    true
  );
  const tempParamsObj = queryString.parse(decodedParams, {
    arrayFormat: 'comma',
    parseNumbers: true
  });
  delete tempParamsObj.packId;

  const paramsString = encodeURL(tempParamsObj);

  return axios
    .get(
      `/api/v2/classif-ai/daily-operations/automation/use-case/metric-cohorts/?${
        paramsString ? `file_set_filters=${paramsString}` : ''
      }&auto_classification_cohorts=0,80,90,100`
    )
    .then(_ => {
      if ((_?.data || []).length === 4) {
        return (_.data || []).slice(0, 3);
      }
      return _.data;
    });
};
const waferAutoClassificationCohort = () => {
  const decodedParams = getParamsFromEncodedString(
    window.location.search,
    true
  );
  const tempParamsObj = queryString.parse(decodedParams, {
    arrayFormat: 'comma',
    parseNumbers: true
  });

  const paramsString = queryString.stringify(tempParamsObj, {
    arrayFormat: 'comma'
  });

  return axios
    .get(
      `/api/v1/classif-ai/wafer-map/metrics/cohort/use_case_level/?${
        paramsString ? `${paramsString}` : ''
      }
			&auto_classification=0,80,90,100`
    )
    .then(_ => {
      if ((_?.data || []).length === 4) {
        return (_.data || []).slice(0, 3);
      }
      return _.data;
    });
};
const getUseCaseAutomation = key => {
  const decodedParams = getParamsFromEncodedString(
    window.location.search,
    true
  );
  const tempParamsObj = queryString.parse(decodedParams, {
    arrayFormat: 'comma',
    parseNumbers: true
  });
  delete tempParamsObj.packId;

  const paramsString = encodeURL(tempParamsObj);

  return axios
    .get(
      `/api/v2/classif-ai/daily-operations/automation/use-case/metrics/?${
        paramsString ? `file_set_filters=${paramsString}` : ''
      }`
    )
    .then(_ => _.data);
};
const waferGetUseCaseAutomation = (key, params, groupBy) => {
  const decodedParams = getParamsFromEncodedString(
    window.location.search,
    true
  );
  const tempParamsObj = queryString.parse(decodedParams, {
    arrayFormat: 'comma',
    parseNumbers: true
  });

  if (groupBy) {
    tempParamsObj.time_format = groupBy;
  }

  const paramsString = queryString.stringify(tempParamsObj, {
    arrayFormat: 'comma'
  });

  return axios
    .get(
      `/api/v1/classif-ai/wafer-map/metrics/?group_by=use_case_id,use_case__name&${
        paramsString ? `${paramsString}` : ''
      }`
    )
    .then(_ => _.data);
};

const getUseCaseAutomationTimeSeries = (key, groupBy) => {
  const decodedParams = getParamsFromEncodedString(
    window.location.search,
    true
  );
  const tempParamsObj = queryString.parse(decodedParams, {
    arrayFormat: 'comma',
    parseNumbers: true
  });

  if (groupBy) {
    tempParamsObj.time_format = groupBy;
  }

  const paramsString = encodeURL(tempParamsObj);

  return axios
    .get(
      `/api/v2/classif-ai/daily-operations/automation/use-case/timeseries-metrics/?${
        paramsString ? `file_set_filters=${paramsString}` : ''
      }&timezone=${getTimeZoneParam()}`
    )
    .then(_ => _.data);
};
const WaferGetUseCaseAutomationTimeSeries = (
  key,
  params,
  groupBy,
  useCaseId
) => {
  const decodedParams = getParamsFromEncodedString(
    window.location.search,
    true
  );
  const tempParamsObj = queryString.parse(decodedParams, {
    arrayFormat: 'comma',
    parseNumbers: true
  });

  if (groupBy) {
    tempParamsObj.time_format = groupBy;
  }
  tempParamsObj.use_case_id__in = useCaseId;

  const paramsString = queryString.stringify(tempParamsObj, {
    arrayFormat: 'comma'
  });

  return axios
    .get(
      `/api/v1/classif-ai/wafer-map/metrics/?group_by=effective_date,use_case_id&grouped_response=use_case_id&order_by=effective_date,use_case_id&${
        paramsString ? `${paramsString}` : ''
      }&timezone=${getTimeZoneParam()}`
    )
    .then(_ => _.data);
};

const usecaseAccuracyCohort = (key, params, unit, status = '') => {
  const decodedParams = getParamsFromEncodedString(window.location.search);
  const tempParamsObj = queryString.parse(decodedParams, {
    arrayFormat: 'comma',
    parseNumbers: true
  });

  const paramsString = queryString.stringify(tempParamsObj, {
    arrayFormat: 'comma'
  });

  return axios
    .get(
      `/api/v1/classif-ai/classification/metrics/cohort/use_case_level/?${
        paramsString ? `${paramsString}` : ''
      }${unit ? `&unit=${unit}` : ''}&accuracy=0,80,90,100${status}`
    )
    .then(_ => _.data);
};

const useCaseAccuracyTimeSeries = (key, params) => {
  const decodedParams = getParamsFromEncodedString(params, true);
  const tempParamsObj = queryString.parse(decodedParams, {
    arrayFormat: 'comma',
    parseNumbers: true
  });

  const paramsString = encodeURL(tempParamsObj);

  return axios
    .get(
      `/api/v2/classif-ai/daily-operations/accuracy/use-case/metrics/?${
        paramsString ? `file_set_filters=${paramsString}` : ''
      }`
    )
    .then(_ => _.data);
};

const DistributionAccuracyCohort = (key, params, unit, level) => {
  const decodedParams = getParamsFromEncodedString(params);
  const tempParamsObj = queryString.parse(decodedParams, {
    arrayFormat: 'comma',
    parseNumbers: true
  });

  const paramsString = queryString.stringify(tempParamsObj, {
    arrayFormat: 'comma'
  });

  return axios
    .get(
      `/api/v1/classif-ai/classification/metrics/cohort/${level}_level/?${
        paramsString ? `${paramsString}` : ''
      }${unit ? `&unit=${unit}` : ''}`
    )
    .then(_ => _.data);
};

const DistributionAccuracy = (key, params, unit, level, waferStatus) => {
  const decodedParams = getParamsFromEncodedString(params);
  const tempParamsObj = queryString.parse(decodedParams, {
    arrayFormat: 'comma',
    parseNumbers: true
  });

  const paramsString = queryString.stringify(tempParamsObj, {
    arrayFormat: 'comma'
  });

  return axios
    .get(
      `/api/v1/classif-ai/classification/metrics/distribution/${level}_level/?${
        paramsString ? `${paramsString}` : ''
      }${unit ? `&unit=${unit}` : ''}${
        waferStatus ? `&wafer__status__in=${waferStatus}` : ''
      }`
    )
    .then(_ => _.data);
};

const getWaferBookData = (key, params, limit = 0, offset = 0) => {
  const decodedParams = getParamsFromEncodedString(params, true);

  const tempParamsObj = queryString.parse(decodedParams, {
    arrayFormat: 'comma',
    parseNumbers: true
  });

  const paramsString = queryString.stringify(tempParamsObj, {
    arrayFormat: 'comma'
  });

  return axios
    .get(
      `/api/v1/classif-ai/wafer-map/wafer-book/?${
        paramsString ? `${paramsString}` : ''
      }&limit=${limit}&offset=${offset}`
    )
    .then(_ => _.data);
};

const defectAccuracyCohort = (key, params, unit, usecase) => {
  const decodedParams = getParamsFromEncodedString(window.location.search);
  const tempParamsObj = queryString.parse(decodedParams, {
    arrayFormat: 'comma',
    parseNumbers: true
  });

  tempParamsObj.use_case_id__in = usecase;

  const paramsString = queryString.stringify(tempParamsObj, {
    arrayFormat: 'comma'
  });

  return axios
    .get(
      `/api/v1/classif-ai/classification/metrics/cohort/defect_level/?${
        paramsString ? `${paramsString}` : ''
      }${unit ? `&unit=${unit}` : ''}&accuracy=0,80,90,100`
    )
    .then(_ => _.data);
};

const defectAccuracyTimeSeries = (key, params, unit, usecase) => {
  const decodedParams = getParamsFromEncodedString(window.location.search);
  const tempParamsObj = queryString.parse(decodedParams, {
    arrayFormat: 'comma',
    parseNumbers: true
  });

  tempParamsObj.use_case_id__in = usecase;

  const paramsString = queryString.stringify(tempParamsObj, {
    arrayFormat: 'comma'
  });

  return axios
    .get(
      `/api/v1/classif-ai/classification/metrics/distribution/defect_level/?${
        paramsString ? `${paramsString}` : ''
      }${unit ? `&unit=${unit}` : ''}`
    )
    .then(_ => _.data);
};

const getWaferLibData = (key, params) => {
  const decodedParams = getParamsFromEncodedString(window.location.search);
  const tempParamsObj = queryString.parse(decodedParams, {
    arrayFormat: 'comma',
    parseNumbers: true
  });

  if (tempParamsObj?.time_format) {
    delete tempParamsObj.time_format;
  }
  if (tempParamsObj?.date__gte) {
    tempParamsObj.created_ts_after = tempParamsObj.date__gte;
    delete tempParamsObj.date__gte;
  }
  if (tempParamsObj?.date__lte) {
    tempParamsObj.created_ts_before = tempParamsObj.date__lte;
    delete tempParamsObj.date__lte;
  }

  const paramsString = queryString
    .stringify(tempParamsObj, { arrayFormat: 'comma' })
    .replace('wafer_id__in', 'id__in');

  return axios
    .get(
      `/api/v1/classif-ai/wafer-map/?${paramsString}
`
    )
    .then(_ => _.data);
};

const getWaferImage = (key, id) => {
  return axios.get(`/api/v1/classif-ai/wafer-map/${id}/`).then(_ => _.data);
};

const getFileSetDefects = (key, ids = [], fieldParams = '') => {
  return axios
    .get(
      `/api/v1/classif-ai/file-set/defect_names/?id__in=${ids.join(',')}${
        fieldParams ? `&fields=${fieldParams}` : ''
      }`
    )
    .then(_ => _.data);
};

const getNextWafer = (id, status) => {
  return axios
    .get(
      `/api/v1/classif-ai/wafer-map/?status__in=${status}&limit=1&ordering=created_ts&id__gt=${id}`
    )
    .then(_ => _.data);
};

const updateKlarfFile = ids => {
  return axios
    .patch(`api/v1/classif-ai/wafer-map/update-klarf-file/?id__in=${ids}`, {
      status: 'manually_classified'
    })
    .then(_ => _.data);
};

const getWaferSummary = (key, id) => {
  return axios
    .get(
      `/api/v1/classif-ai/classification/metrics/distribution/wafer_level/?wafer_id__in=${id}`
    )
    .then(_ => _.data);
};

const getNotifications = (key, cursor) => {
  // ?${cursor ? `cursor=${cursor}` : ''}
  return axios
    .get(`/api/v1/notifications/?${cursor ? `cursor=${cursor}` : ''}`)
    .then(_ => _.data);
};

const getNotificationCount = () => {
  return axios.get(`/api/v1/notifications/get_count`).then(_ => _.data);
};

const getConfigUsecases = (key, ids) => {
  return axios
    .get(`/api/v1/classif-ai/use-case/${ids ? `?id__in=${ids}` : ''}`)
    .then(_ => _.data);
};

const setIsReadNotification = (id, status = true) => {
  return axios
    .patch(`api/v1/notifications/${id}/`, {
      is_read: status
    })
    .then(_ => _.data);
};

const getUsecaseById = id =>
  axios.get(`/api/v1/classif-ai/use-case/${id}/`).then(_ => _.data);

const updateTrainingModelName = (id, name) => {
  return axios
    .patch(`/api/v1/classif-ai/ml-model/${id}/`, { name })
    .then(_ => _.data);
};

const getDefectInstances = (key, trainingSession, params) => {
  return axios
    .get(
      `/api/v1/classif-ai/training-session/${trainingSession}/defects/?${params}`
    )
    .then(_ => _.data);
};

const addModelDefects = (modelId, data) =>
  axios.post(`/api/v1/classif-ai/ml-model/${modelId}/defects/`, data);

const deleteModelDefects = (modelId, data) =>
  axios.delete(`/api/v1/classif-ai/ml-model/${modelId}/defects/`, { data });

const addFilesToTraining = params =>
  axios.post(
    `/api/v1/classif-ai/training-session-file-sets/bulk-create/`,
    params
  );

const removeFilesFromTraining = params =>
  axios.delete(`/api/v1/classif-ai/training-session-file-sets/bulk-delete/`, {
    data: params
  });

const reviewTrainingDefectData = (key, sessionId) =>
  axios
    .get(`/api/v1/classif-ai/training-session/${sessionId}/summary/`)
    .then(_ => _.data);

const startModelTraining = sessionId =>
  axios.post(`/api/v1/classif-ai/training-session/${sessionId}/start/`);

const getTrainingSession = sessionId =>
  axios
    .get(`/api/v1/classif-ai/training-session/${sessionId}/`)
    .then(_ => _.data);

const undeployModel = id =>
  axios.patch(`/api/v1/classif-ai/ml-model/${id}/undeploy/`);

const copyFilesToFolder = data =>
  axios.post(`/api/v1/classif-ai/file-set/copy/`, data).then(_ => _.data);

const getAllTasks = (key, params) =>
  axios
    .get(
      `/api/v1/classif-ai/tasks/${params || ''}&${
        params.includes('limit') ? '' : 'limit=10'
      }`
    )
    .then(_ => _.data);

const retryTask = id =>
  axios.put(`/api/v1/classif-ai/tasks/${id}/retry/`).then(_ => _.data);

const bulkAddToTraining = params =>
  axios
    .post(
      `/api/v1/classif-ai/training-session-file-sets/async-bulk-create/`,
      params
    )
    .then(_ => _.data);

const bulkRemoveFromTraining = params =>
  axios
    .delete(
      `/api/v1/classif-ai/training-session-file-sets/async-bulk-delete/`,
      { data: params }
    )
    .then(_ => _.data);

const addNewUser = data => axios.post(`/api/v1/users/`, data).then(_ => _.data);

const updateUser = (id, data) =>
  axios.put(`/api/v1/users/${id}/`, data).then(_ => _.data);

const createUserTags = data =>
  axios.post(`/api/v1/classif-ai/file-set/allocate-user-tags/`, data);

const annotationDefectsByFileSet = (fileSetFilers, autoModelFilters) =>
  axios
    .get(
      `/api/v2/classif-ai/annotations/list-grouped-by-fileset/?file_set_filters=${fileSetFilers}&model_annotation_filters=${autoModelFilters}`
    )
    .then(_ => _.data);

const getComment = (key, id) =>
  axios
    .get(`/api/v1/classif-ai/comment-threads/?file_set=${id}`)
    .then(res => res.data);

const createComment = data =>
  axios.post(`/api/v1/classif-ai/comment-threads/`, data);

const updateComment = (id, data) =>
  axios.put(`/api/v1/classif-ai/comments/${id}/`, data);

const deleteComment = id =>
  axios.delete(`/api/v1/classif-ai/comment-threads/${id}/`);

const getDataset = key =>
  axios.get(`/api/v1/classif-ai/data-set/`).then(res => res.data);

const createDataset = data => axios.post(`/api/v1/classif-ai/data-set/`, data);

const updateDataset = (id, data) =>
  axios.put(`/api/v1/classif-ai/data-set/${id}/`, data);

const deleteDataset = id => axios.delete(`/api/v1/classif-ai/data-set/${id}/`);

const addFilesetsToDataset = (id, data) =>
  axios.post(`/api/v1/classif-ai/data-set/${id}/file-sets/`, data);

const deleteFileSetFromDataset = (id, data) =>
  axios.delete(`/api/v1/classif-ai/data-set/${id}/file-sets/`, { data });

const bulkDefectCSVUpload = data =>
  axios.post(`/api/v1/classif-ai/defects/bulk_create_from_csv/`, data);

const markBulkAiLabels = data =>
  axios
    .post(`/api/v1/classif-ai/user-classification/bulk_create/`, data)
    .then(_ => _.data);

const trainingConfig = (trainingSession, data) =>
  axios
    .patch(`api/v1/classif-ai/training-session/${trainingSession}/`, data)
    .then(_ => _.data);

const checkDistinctAutoModel = fileSetFilter =>
  axios
    .get(
      `/api/v1/classif-ai/file-set/model/distinct/?file_set_filters=${fileSetFilter}`
    )
    .then(_ => _.data);

const getAccuracyCurv = (key, id) =>
  axios
    .get(`/api/v1/classif-ai/training-performance-logs/?training_session=${id}`)
    .then(_ => _.data);

const getWaferMetaFilters = (data, params, filterIds) => {
  const { date__gte, date__lte } = getDateFromParams(
    window.location.search,
    'YYYY-MM-DD'
  );

  return axios
    .get(
      `/api/v1/classif-ai/wafer-map-meta-info/${data}/distinct?date__gte=${date__gte}-00-00-00&date__lte=${date__lte}-23-59-59`
    )
    .then(_ => {
      const { data } = _.data;

      if (filterIds) {
        filterIds = (Array.isArray(filterIds) ? filterIds : [filterIds]).map(
          d => d.toString()
        );

        return {
          results: data
            .filter(item => filterIds.includes(item))
            .map(item => ({
              id: convertDataType(item),
              name: item,
              value: convertDataType(item)
            })),
          next: null,
          prev: null
        };
      }

      return {
        results: data
          .filter(item => item)
          .map(item => ({
            id: convertDataType(item),
            name: item,
            value: convertDataType(item)
          })),
        next: null,
        prev: null
      };
    });
};

const getWaferListForKlarfUpdate = (key, ids) =>
  axios
    .get(`/api/v1/classif-ai/wafer-map/wafer-book/?id__in=${ids}`)
    .then(_ => _.data);

const getWaferBookText = waferId =>
  axios
    .get(`/api/v1/classif-ai/wafer-map/${waferId}/generate-wafermap-txt/`)
    .then(_ => {
      handleFileDownload(_);
      return _.data;
    });

const activeWaferBook = data =>
  axios.post(`/api/v1/classif-ai/wafer-map/active/`, data);

const inactiveWaferBook = data =>
  axios.post(`/api/v1/classif-ai/wafer-map/inactive/`, data);

const getWaferBookZip = waferIds =>
  axios
    .get(
      `/api/v1/classif-ai/wafer-map/generate-multiple-wafermap-txt/?ids=${waferIds}`,
      { responseType: 'blob' }
    )
    .then(_ => {
      handleFileDownload(_);
      return _.data;
    });

const getSimilarImages = params =>
  axios.post(`/api/v2/classif-ai/similar-images/generate/`, params);

const fetchDataCards = (key, params, is24x7 = true) => {
  const paramsString = encodeString(getParamsFromEncodedString(params, true));

  return axios
    .get(
      `/api/v2/classif-ai/daily-operations/${
        is24x7 ? 'automation' : 'accuracy'
      }/metrics/?${paramsString ? `file_set_filters=${paramsString}` : ''}`
    )
    .then(_ => _.data);
};
const saveFiltersJSON = ({ modelId, params }) =>
  axios.patch(`api/v1/classif-ai/ml-model/${modelId}/`, params);

export default {
  saveFiltersJSON,
  getSimilarImages,
  updateUseCase,
  createUseCase,
  getFilters,
  getPacks,
  getUploadSessions,
  getSubscriptions,
  uploadFiles,
  getSessionId,
  getFileSets,
  getMlModels,
  getWaferMap,
  getFileSetLabels,
  getRegions,
  getDefects,
  getInferenceStatus,
  fileSetInferenceQueue,
  addFileRegion,
  updateFileRegion,
  performaceSummary,
  getAllUploadSessions,
  markNoDefect,
  getUserInfo,
  logout,
  getFileSet,
  getDetailedReport,
  uploadMetaInfo,
  applicationCharts,
  useCase,
  getDefectImage,
  predictionCsv,
  getDistinctUploadSessions,
  getTrainingData,
  tainingSessionFileSets,
  createTrainingSession,
  pollTrainingSession,
  accuracyTrend,
  overkillTrend,
  getSubscription,
  uploadModel,
  updateModelById,
  checkModelName,
  aiResultsCsv,
  createEditDefect,
  useCaseDefects,
  deleteUseCase,
  updateUseCaseDefects,
  useCaseMetaInfo,
  getUseCaseMetaInfo,
  deleteUseCaseMetaInfo,
  getDefect,
  defectDetails,
  getUseCaseDefects,
  getUseCaseDetails,
  updateDefect,
  updateUseCaseMetaInfo,
  confusionMatrix,
  deleteFileSet,
  login,
  deleteDefect,
  leadLevelCsv,
  bulkCreateFileSetInferenceQueue,
  deleteUploadSession,
  deleteModel,
  relatedDefects,
  getPaginatedModels,
  dashboardPerformaceSummary,
  deployModel,
  bookmarkFileSet,
  bookmarkFolders,
  bulkFeedback,
  stitchImages,
  packDetails,
  terminateModelProgress,
  getAutoModel,
  distinctUseCaseForFileSets,
  updateOverkillDefect,
  getOverkillDefects,
  fileSetInferenceQueueProgressStatus,
  getMlModelByid,
  getMlModelWeightedDefects,
  updateMlModelWeightedDefects,
  getSimilarityVsPerformanceCSV,
  getClasswiseMatrix,
  getUserClassification,
  updateUserClassification,
  addUserClassification,
  getUserClassificationById,
  getUserDetection,
  addUserDetection,
  deleteGTClassification,
  updateUserDetection,
  deleteUserDetection,
  getModelClassification,
  getModelDetection,
  getautoClassificationDefectLevel,
  getautoClassificationTimeSeries,
  getaccuracyDefectLevelTimeSeries,
  getaccuracyDefectLevel,
  getautoClassificationWaferLevel,
  getautoClassificationWaferLevelTimeSeries,
  getaccuracyWaferLevelTimeSeries,
  getaccuracyWaferLevel,
  getModelDefects,
  missclassificationDefect,
  defectLevelMatrics,
  useCaseLevelMatrics,
  getAllUsers,
  addBulkClassification,
  replaceBulkClassification,
  deleteBulkClassification,
  markOperatorBulkGTClassification,
  replaceBulkDetection,
  deleteBulkDetection,
  overAllData,
  autoClassificationCohort,
  getUseCaseAutomation,
  getUseCaseAutomationTimeSeries,
  usecaseAccuracyCohort,
  useCaseAccuracyTimeSeries,
  DistributionAccuracyCohort,
  DistributionAccuracy,
  defectAccuracyCohort,
  defectAccuracyTimeSeries,
  getWaferLibData,
  getWaferImage,
  getFileSetDefects,
  getNextWafer,
  updateKlarfFile,
  getWaferSummary,
  getNotifications,
  getNotificationCount,
  getConfigUsecases,
  setIsReadNotification,
  getUsecaseById,
  updateTrainingModelName,
  getDefectInstances,
  addModelDefects,
  deleteModelDefects,
  addFilesToTraining,
  removeFilesFromTraining,
  reviewTrainingDefectData,
  startModelTraining,
  getTrainingSession,
  undeployModel,
  copyFilesToFolder,
  getAllTasks,
  retryTask,
  bulkAddToTraining,
  bulkRemoveFromTraining,
  addNewUser,
  updateUser,
  updateTagsonUploadsession,
  removeTagsOnUploadsession,
  getUploadSessionsTags,
  getAllUploadSessionsTags,
  getUploadsessionTagByid,
  createuploadsessionTag,
  updateTagsOnFilesets,
  removeTagsOnFilesets,
  getAllFilesetTags,
  getFilesetTags,
  getFilesetTagByid,
  createNewFilesetTag,
  getWaferTagByid,
  removeTagsOnWafers,
  updateTagsOnWafers,
  createNewWaferTag,
  getAllWaferTags,
  getWaferTags,
  markAllLabels,
  getWaferTagsByName,
  waferAutoClassificationCohort,
  waferGetautoClassificationTimeSeries,
  waferGetUseCaseAutomation,
  WaferGetUseCaseAutomationTimeSeries,
  WaferOverAllData,
  getWaferBookData,
  getPaginateWaferMap,
  getAllPaginatedWaferTags,
  getAllPaginatedFilesetTags,
  getAllPaginatedUploadSessionsTags,
  getPaginatedMlModels,
  getDefectsByIds,
  getUploadSessionsByIds,
  useCaseByIds,
  getUploadSessionsFilters,
  createUserTags,
  annotationDefectsByFileSet,
  getBaseMlModelById,
  getBaseMlModel,
  getComment,
  createComment,
  updateComment,
  deleteComment,
  getDataset,
  createDataset,
  updateDataset,
  deleteDataset,
  addFilesetsToDataset,
  deleteFileSetFromDataset,
  getPackById,
  bulkDefectCSVUpload,
  markBulkAiLabels,
  trainingConfig,
  checkDistinctAutoModel,
  getAccuracyCurv,
  getWaferMetaFilters,
  getWaferListForKlarfUpdate,
  getWaferBookText,
  activeWaferBook,
  inactiveWaferBook,
  getWaferBookZip,
  fetchDataCards
};
