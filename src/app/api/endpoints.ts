const API_VERSIONS = {
  v1: 'v1',
  v2: 'v2'
};

interface EndpointsType {
  [x: string]: {
    version: string;
  } & (
    | {
        endpoint: string;
      }
    | {
        endpoint: (...param: any) => string;
      }
  );
}

// TODO: Child level should also be able to change the version of the api

export const ENDPOINTS_CONSTANTS: EndpointsType = {
  USECASE: {
    endpoint: 'use-case',
    version: API_VERSIONS.v1
  },
  FILE_SET: {
    endpoint: 'file-set',
    version: API_VERSIONS.v1
  },
  ML_MODEL: {
    endpoint: 'ml-model',
    version: API_VERSIONS.v1
  },
  DEFECTS: {
    endpoint: 'defects',
    version: API_VERSIONS.v1
  },
  UAT: {
    endpoint: `model-performance`,
    version: API_VERSIONS.v2
  },
  RAW_CONFUSION_MATRICS: {
    endpoint: (id: number) => `ml-model/${id}`,
    version: API_VERSIONS.v2
  },
  ML_MODEL_DEPLOYMENT_HISTORY: {
    endpoint: `ml-model-deployment-history/automation/metrics`,
    version: API_VERSIONS.v2
  }
};
