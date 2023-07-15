export const SET_DRAWER_STATE = 'SET_DRAWER_STATE';
export const SET_DRAWER_STATUS = 'SET_DRAWER_STATUS';
export const SET_MODE = 'SET_MODE';
export const SET_UNIT = 'SET_UNIT';
export const SET_CONFUSION_USE_CASE = 'SET_CONFUSION_USE_CASE';
export const SET_CONFUSION_MODEL = 'SET_CONFUSION_MODEL';
export const SET_DRAWER_USECASE = 'SET_DRAWER_USECASE';
export const SET_ACTIVE_USECASE_COUNT = 'SET_ACTIVE_USECASE_COUNT';
export const SET_MISSCLASSIFICATION_IMAGES_ROW_IDS =
  'SET_MISSCLASSIFICATION_IMAGES_ROW_IDS';

export const CLASSIFY = 'CLASSIFY';
export const AUDIT = 'AUDIT';

export const AI_PERFORMANCE_ROUTES = {
  MONITORING: { path: '24*7-monitoring', label: '24*7 Monitoring' },
  ON_DEMAND_AUDIT: { path: 'on-demand-audit', label: 'On-Demand Audit' },
  UAT: { path: 'uat', label: 'UAT' },
  UNIT_WAFER: { path: 'wafer', label: 'Wafer' },
  UNIT_IMAGES: { path: 'file', label: 'Images' }
};

export const MODEL_PERFORMANCE = 'MODEL_PERFORMANCE';

export const SET_DEFECT_DISTRIBUTION_INDIVIDUAL_LOADING =
  'SET_DEFECT_DISTRIBUTION_INDIVIDUAL_LOADING';

export const SET_DEFECT_DISTRIBUTION_DATA = 'SET_DEFECT_DISTRIBUTION_DATA';

export const RESET_DEFECT_DISTRIBUTION_DATA = 'RESET_DEFECT_DISTRIBUTION_DATA';

// export const SET_CONFUSION_MATRICS = 'SET_CONFUSION_MATRICS';
// export const SET_CONFUSION_MATRICS_LOADING = 'SET_CONFUSION_MATRICS_LOADING';

// export const SET_MISCLASSIFICATION_PAIR = 'SET_MISCLASSIFICATION_PAIR';
// export const SET_MISCLASSIFICATION_PAIR_LOADING =
//   'SET_MISCLASSIFICATION_PAIR_LOADING';

// export const SET_DEFECT_BASED_DISTRIBUTION = 'SET_DEFECT_BASED_DISTRIBUTION';
// export const SET_DEFECT_BASED_DISTRIBUTION_LOADING =
//   'SET_DEFECT_BASED_DISTRIBUTION_LOADING';

// export const SET_FOLDER_BASED_DISTRIBUTION = 'SET_FOLDER_BASED_DISTRIBUTION';
// export const SET_FOLDER_BASED_DISTRIBUTION_LOADING =
//   'SET_FOLDER_BASED_DISTRIBUTION_LOADING';

// export const SET_WAFER_BASED_DISTRIBUTION = 'SET_WAFER_BASED_DISTRIBUTION';
// export const SET_WAFER_BASED_DISTRIBUTION_LOADING =
//   'SET_WAFER_BASED_DISTRIBUTION_LOADING';

export const WAFER_STATUS_CONSTANTS = {
  auto_classified: 'Auto Classified',
  manually_classified: 'Manually Classified',
  manual_classification_pending: 'Pending Manual',
  pending: 'Pending',
  error: 'Error'
};

export const MODEL_STATUS_CONSTANTS = {
  draft: 'Draft',
  training: 'Training',
  ready_for_deployment: 'Ready for Deployment',
  training_failed: 'Training failed',
  deployed_in_prod: 'Deployed in production',
  // deleted: 'Deleted',
  user_terminated: 'Terminated by user',
  retired: 'Retired after deployment'
};

export const DEFECT_DISTRIBUTION_CONSTANTS = {
  CONFUSION_MATRICS: 'confusionMatric',
  MISCLASSIFICATION_PAIR: 'misclassificationPair',
  DEFECT_BASED_DISTRIBUTION: 'defectBasedDistribution',
  FOLDER_BASED_DISTRIBUTION: 'folderBasedDistribution',
  WAFER_BASED_DISTRIBUTION: 'waferBasedDistribution',
  USECASE_DEFECTS: 'usecaseDefects'
};
