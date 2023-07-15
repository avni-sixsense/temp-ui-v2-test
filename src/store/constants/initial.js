import dayjs from 'dayjs';
import { DEFECT_DISTRIBUTION_CONSTANTS } from 'store/aiPerformance/constants';

const utc = require('dayjs/plugin/utc'); // dependent on utc plugin
const timezone = require('dayjs/plugin/timezone');
const customParseFormat = require('dayjs/plugin/customParseFormat');

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(customParseFormat);

export const timeZone = dayjs.tz.guess();
const today = dayjs().tz(timeZone);
export const start = today.subtract(6, 'day').startOf('day').toDate();
export const end = today.endOf('day').toDate();

const initialState = {
  upload: {
    sessions: [],
    metaCount: 0,
    uploadInProgress: false
  },
  reviewButtons: {
    data: {
      aiAssistance: ['Add AI Model'],
      'scratch-annotation': {
        'single-fileset': [
          'Add',
          'Replace',
          'Remove',
          // 'Mark AI label Correct',
          'Replace Class',
          'Delete Box',
          'Remove Class',
          // 'Mark all Boxes Correct',
          'Add Comment',
          'Add Tag(s)'
        ],
        'multiple-fileSets': [
          'Add',
          'Replace',
          'Remove',
          // 'Mark AI label Correct',
          'Replace Class',
          'Delete Box',
          'Remove Class',
          // 'Mark all Boxes Correct',
          'Add Comment',
          'Add Tag(s)'
        ],
        'single-box-ai': [
          // 'Mark AI label Correct',
          'Replace Class',
          'Delete Box',
          'Remove Class',
          // 'Mark all Boxes Correct',
          'Add Comment',
          'Add Tag(s)'
        ],
        'single-box-user': [
          'Replace Class',
          'Delete Box',
          'Remove Class',
          'Add Comment',
          'Add Tag(s)'
        ],
        'multiple-boxes': [
          // 'Mark AI label Correct',
          'Replace Class',
          'Delete Box',
          'Remove Class',
          // 'Mark all Boxes Correct',
          'Add Comment'
        ]
      },
      'ai-annotation': {
        'single-fileset': [
          'Add',
          'Replace',
          'Remove',
          'Mark AI label Correct',
          'Replace Class',
          'Delete Box',
          'Remove Class',
          'Mark all Boxes Correct',
          'Add Comment',
          'Add Tag(s)'
        ],
        'multiple-fileSets': [
          'Add',
          'Replace',
          'Remove',
          'Mark AI label Correct',
          'Replace Class',
          'Delete Box',
          'Remove Class',
          'Mark all Boxes Correct',
          'Add Comment',
          'Add Tag(s)'
        ],
        'single-box-ai': [
          'Mark AI label Correct',
          'Replace Class',
          'Delete Box',
          'Remove Class',
          'Mark all Boxes Correct',
          'Add Comment',
          'Add Tag(s)'
        ],
        'single-box-user': [
          'Replace Class',
          'Delete Box',
          'Remove Class',
          'Add Comment',
          'Add Tag(s)'
        ],
        'multiple-boxes': [
          'Mark AI label Correct',
          'Replace Class',
          'Delete Box',
          'Remove Class',
          'Mark all Boxes Correct',
          'Add Comment'
        ]
      },
      'ground-truth-correction': {
        'single-fileset': [
          'Add',
          'Replace',
          'Remove',
          'Replace Class',
          'Delete Box',
          'Remove Class',
          'Add Comment',
          'Add Tag(s)'
        ],
        'multiple-fileSets': [
          'Add',
          'Replace',
          'Remove',
          'Replace Class',
          'Delete Box',
          'Remove Class',
          'Add Comment',
          'Add Tag(s)'
        ],
        'single-box-other': ['Add Comment', 'Add Tag(s)'],
        'single-box-gt': [
          'Add',
          'Replace',
          'Remove',
          'Replace Class',
          'Delete Box',
          'Remove Class',
          'Add Comment',
          'Add Tag(s)'
        ],
        'multiple-boxes': ['Replace Class', 'Add Comment']
      },
      'general-viewing': {
        'single-fileset': ['Add Comment', 'Add Tag(s)'],
        'multiple-fileSets': ['Add Comment', 'Add Tag(s)'],
        'single-box-self': ['Add Comment', 'Add Tag(s)'],
        'single-box-other': ['Add Comment', 'Add Tag(s)'],
        'multiple-boxes': ['Add Comment']
      },
      'reviewer-annotation': {
        'single-fileset': [
          'Add',
          'Replace',
          'Remove',
          'Mark AI label Correct',
          'Replace Class',
          'Delete Box',
          'Remove Class',
          'Mark all Boxes Correct',
          'Add Comment',
          'Add Tag(s)'
        ],
        'multiple-fileSets': [
          'Add',
          'Remove',
          'Mark AI label Correct',
          'Replace Class',
          'Delete Box',
          'Remove Class',
          'Mark all Boxes Correct',
          'Add Comment',
          'Add Tag(s)'
        ],
        'single-box-ai': [
          'Mark AI label Correct',
          'Replace Class',
          'Delete Box',
          'Remove Class',
          'Mark all Boxes Correct',
          'Add Comment',
          'Add Tag(s)'
        ],
        'single-box-user': [
          'Replace Class',
          'Delete Box',
          'Remove Class',
          'Add Comment',
          'Add Tag(s)'
        ],
        'multiple-boxes': [
          'Mark AI label Correct',
          'Replace Class',
          'Delete Box',
          'Remove Class',
          'Mark all Boxes Correct',
          'Add Comment'
        ]
      },
      review: {
        'single-fileset': [
          'Add',
          'Replace',
          'Remove',
          'Replace Class',
          'Delete Box',
          'Add Comment',
          'Add Tag(s)'
        ],
        'multiple-fileSets': [
          'Add',
          'Replace',
          'Remove',
          // 'Labelling Guide',
          'Mark AI label Correct',
          'Mark as Label',
          'Replace Class',
          'Delete Box',
          'Add Comment',
          'Add Tag(s)'
        ],
        'single-box-ai': [
          'Add',
          'Replace',
          'Remove',
          'Replace Class',
          'Delete Box',
          'Add Comment',
          'Add Tag(s)'
        ],
        'single-box-user': [
          'Add',
          'Replace',
          'Remove',
          'Replace Class',
          'Delete Box',
          'Add Comment',
          'Add Tag(s)'
        ],
        'multiple-boxes': [
          'Add',
          'Replace',
          'Remove',
          'Replace Class',
          'Delete Box',
          'Add Comment',
          'Add Tag(s)'
        ]
      },
      audit: {
        'single-fileset': [
          'Add',
          'Replace',
          'Remove',
          'Replace Class',
          'Delete Box',
          'Add Comment',
          'Add Tag(s)'
        ],
        'multiple-fileSets': [
          'Add',
          'Replace',
          'Remove',
          'Replace Class',
          'Delete Box',
          'Add Comment',
          'Add Tag(s)'
        ],
        'single-box-ai': [
          'Add',
          'Replace',
          'Remove',
          'Replace Class',
          'Delete Box',
          'Add Comment',
          'Add Tag(s)'
        ],
        'single-box-user': [
          'Add',
          'Replace',
          'Remove',
          'Replace Class',
          'Delete Box',
          'Add Comment',
          'Add Tag(s)'
        ],
        'multiple-boxes': [
          'Add',
          'Replace',
          'Remove',
          'Replace Class',
          'Delete Box',
          'Add Comment',
          'Add Tag(s)'
        ]
      },
      'manual-classify': {
        'single-fileset': [
          'Add',
          'Replace',
          'Remove',
          'Replace Class',
          'Delete Box',
          'Add Comment',
          'Add Tag(s)'
        ],
        'multiple-fileSets': [
          'Add',
          'Replace',
          'Remove',
          'Mark AI label Correct',
          'Mark as Label',
          'Replace Class',
          'Delete Box',
          'Add Comment',
          'Add Tag(s)'
        ],
        'single-box-ai': [
          'Add',
          'Replace',
          'Remove',
          'Replace Class',
          'Delete Box',
          'Add Comment',
          'Add Tag(s)'
        ],
        'single-box-user': [
          'Add',
          'Replace',
          'Remove',
          'Replace Class',
          'Delete Box',
          'Add Comment',
          'Add Tag(s)'
        ],
        'multiple-boxes': [
          'Add',
          'Replace',
          'Remove',
          'Replace Class',
          'Delete Box',
          'Add Comment',
          'Add Tag(s)'
        ]
      }
    },
    availableButtons: ['View all Similar Images'],
    isAIAnnotation: false
  },
  review: {
    data: [],
    fetchingReviewData: true,
    fileSetCount: 0,
    uploadSessionId: '',
    next: null,
    gridModes: [{ label: 'Canvas View' }, { label: 'Grid View' }],
    activeGridMode: 'Canvas View',
    imageModes: [],
    activeImageMode: '',
    activeImg: [0],
    fileSetDefects: {},
    isFileSetDefectsLoading: false,
    userClassification: { count: 0, data: {} },
    selectedTool: 'select',
    annotatorInput: [
      {
        id: '',
        src: '',
        name: '',
        regions: []
      }
    ],
    useAIAssistance: true,
    appliedForAllModelId: null,
    modelVisibilityObj: {},
    modelDetectionList: [],
    userDetectionList: [],
    modelsDict: {},
    aiDefects: [],
    taskId: null,
    otherDefects: [],
    sorting: {
      sortDirection: 'ascending',
      sortBy: 'created_ts'
    },
    selectAll: false,
    containerMeta: null,
    isBulkClassificationUpdating: false,
    isUserClassificationLoading: false,
    searchText: ''
  },
  filters: {
    filters: {},
    folderDict: {},
    filtersLoaded: false,
    params: {},
    paramsString: '',
    packId: '',
    date: { start, end }
  },
  common: {
    userInfo: {},
    models: [],
    modelsDict: {},
    defects: [],
    defectsDict: {},
    useCase: [],
    useCaseLoaded: false,
    useCaseLoading: false,
    userInfoLoaded: false,
    defectsLoaded: false,
    modelsLoaded: false,
    modelsLoading: false,
    defectsLoading: false,
    userInfoLoading: false,
    subscriptionLoaded: false
  },
  pagination: {
    defaultPageSize: 30
  },
  defectLibrary: {
    drawerOpen: false,
    activeStep: 0,
    selected: [],
    allSelected: false,
    bookmarked: [],
    allBookmarked: false,
    mode: '',
    defect: {},
    total: 0,
    globalMode: '',
    expandAll: false,
    data: [],
    rowsPerPage: 30,
    page: 1
  },
  modelLibrary: {
    drawerOpen: false,
    activeStep: 0,
    selected: [],
    allSelected: false,
    bookmarked: [],
    allBookmarked: false,
    trainModelId: null,
    model: {},
    uploadModelDrawer: false,

    showProgress: false,
    total: 0,
    uploaded: 0,
    showTrainProgress: false
  },
  allUploads: {
    drawerOpen: false,
    activeStep: 0,
    inferenceSelected: [],
    data: [],
    downloadBtn: false,
    downloading: false,
    page: 1,
    rowsPerPage: 30,
    total: 0,
    dataset: [],
    infoModes: [
      { label: 'Folder', sublabel: '' },
      { label: 'Datasets', sublabel: '' }
    ],
    infoMode: 'Folder'
  },
  usecase: {
    drawerOpen: false,
    activeStep: 0,
    selected: [],
    data: [],
    page: 1,
    rowsPerPage: 30,
    usecase: {},
    mode: '',
    globalMode: '',
    modelDefectDrawer: false
  },
  aiPerformance: {
    drawerOpen: false,
    drawerStatus: '',
    mode: '',
    unit: '',
    confusionUsecase: {},
    confusionModel: {},
    drawerUsecase: null,
    activeUsecaseCount: null,
    misclassificationImagesRowIds: {},
    defectDistribution: {
      [DEFECT_DISTRIBUTION_CONSTANTS.USECASE_DEFECTS]: {
        isLoading: false,
        data: {},
        isError: false
      },
      [DEFECT_DISTRIBUTION_CONSTANTS.CONFUSION_MATRICS]: {
        isLoading: false,
        data: {},
        isError: false
      },
      [DEFECT_DISTRIBUTION_CONSTANTS.MISCLASSIFICATION_PAIR]: {
        isLoading: false,
        data: [],
        isError: false
      },
      [DEFECT_DISTRIBUTION_CONSTANTS.DEFECT_BASED_DISTRIBUTION]: {
        isLoading: false,
        data: [],
        isError: false
      },
      [DEFECT_DISTRIBUTION_CONSTANTS.FOLDER_BASED_DISTRIBUTION]: {
        isLoading: false,
        data: [],
        isError: false
      },
      [DEFECT_DISTRIBUTION_CONSTANTS.WAFER_BASED_DISTRIBUTION]: {
        isLoading: false,
        data: [],
        isError: false
      }
    }
  },
  notifications: {
    data: [],
    total: 0,
    read: 0,
    unread: 0,
    next: null
  },
  configuration: {
    usecases: []
  },
  helpers: {
    usecases: {},
    wafers: {},
    models: {},
    modelLoading: false,
    usecasesLoading: false,
    wafersLoading: false,
    waferTableStructure: []
  },
  modelTraining: {
    activeStep: 0,
    modelName: '',
    newModel: {},
    isEdit: false,
    isDialogOpen: false,
    dialogVariant: null,
    activeImg: [],
    selectAll: false,
    fileSetData: [],
    fetchingFileSets: false,
    next: null,
    count: 0,
    defectsInstancesCountAdded: 0,
    defectsInstancesCountNotAdded: 0,
    addedToTraining: null,
    notAddedToTraining: null,
    usecase: {},
    oldModel: {},
    selectedDefects: [],
    isSameModelNameError: false,
    fileSetDefects: {},
    isFileSetDefectsLoading: false,
    activeTrainingMode: 'Not Added for Training',
    pendingTaskId: '',
    shouldTrainingOpen: false,
    trainingDataInformation: {},
    trainingConfiguration: {
      training_data_percentage: 60,
      validation_data_percentage: 20,
      test_data_percentage: 20,
      image_resolution: 576,
      no_of_epochs: 0
    },
    containerMeta: null
  },
  taskQueue: {
    tasks: [],
    pendingStatusIds: [],
    activeMode: 'All',
    nextPointer: null
  },
  filterQuries: {
    model: {},
    folder: {},
    defect: {},
    usecase: {},
    groundTruth: {},
    gtModel: {},
    wafermap: {},
    aiOutput: {}
  }
};

export default initialState;
