export const GLOBAL_CONSTS = {
  BULK_CREATE_SYNC_LIMIT: 20000,
  DB_NAME: 'SixSense',
  STORE_NAME: 'refresh'
};

export const TOOL_KEYS = {
  r: 'create-box',
  s: 'select',
  v: 'pan',
  z: 'zoom'
};

export const DEFECT_HOT_KEYS = {};

export const FILTER_KEYS = {
  FOLDER_FILTER_KEY: 'upload_session_id__in',
  USECASE_FILTER_KEY: 'use_case_id__in',
  IMAGE_TAG_FILTER_KEY: 'tags__in',
  WAFER_FILTER_KEY: 'wafer_id__in',
  ML_MODEL_FILTER_KEY: 'ml_model_id__in',
  GROUND_TRUTH_FILTER_KEY: 'ground_truth_label__in',
  TRAINING_TYPE_FILTER_KEY: 'train_type__in',
  BOOKMARK_FILTER_KEY: 'is_bookmarked',
  DATE_FILTERS_KEYS: [
    'date',
    'date__gte',
    'date__lte',
    'created_ts__after',
    'created_ts__before'
  ]
};
