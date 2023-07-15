import { lazy } from 'react';

import DashboardIcon from 'assests/images/sidebar/dashboard.svg';
import LibraryIcon from 'assests/images/sidebar/library.svg';
import DataLibIcon from 'assests/images/sidebar/data.svg';
import DataLibIconActive from 'assests/images/sidebar/dataActive.svg';
import ModelLibIcon from 'assests/images/sidebar/model.svg';
import ModelLibIconActive from 'assests/images/sidebar/modelActive.svg';
import DefectLibIcon from 'assests/images/sidebar/defect.svg';
import DefectLibIconActive from 'assests/images/sidebar/defectActive.svg';
import ConfigurationIcon from 'assests/images/cog.svg';
import NotificationsIcon from 'assests/images/bell.svg';

import { SYSTEM_CONFIG } from 'store/configuration/constants';
import { AI_PERFORMANCE_ROUTES } from 'store/aiPerformance/constants';

const AIPerformance = lazy(() => import('app/routes/dashboard/AIPerformance'));
const Login = lazy(() => import('app/routes/Pages/login/LoginPage'));
const SignUp = lazy(() => import('app/routes/Pages/signup/Signup'));
const ForgotPassword = lazy(() =>
  import('app/routes/Pages/forgotPassword/ForgotPassword')
);
const SignupSuccess = lazy(() =>
  import('app/routes/Pages/signup/SignupSuccess')
);
const UnlockScreen = lazy(() => import('app/routes/Pages/unlock/UnlockScreen'));
const Loading = lazy(() => import('app/routes/Pages/loading/Loading'));
const TryDemo = lazy(() => import('app/routes/Pages/tryDemo/TryDemo'));
const DataLibrary = lazy(() => import('app/routes/Library/DataLibrary'));
const Reviewdata = lazy(() => import('app/routes/reviewData'));
const ModelLibrary = lazy(() => import('app/routes/Library/ModelLibrary'));

const SimilarityThreshold = lazy(() =>
  import('app/routes/Library/ModelLibrary/ThresholdPerformanceGraph')
);

const ModelTraining = lazy(() =>
  import('app/routes/Library/ModelLibrary/ModelTraining')
);
const ModelPerformance = lazy(() =>
  import('app/routes/Library/ModelLibrary/ModelPerformance')
);

const DefectLibrary = lazy(() => import('app/routes/Library/DefectLibrary'));
const UseCaseLibrary = lazy(() => import('app/routes/Library/UseCaseLibrary'));
const Notifications = lazy(() => import('app/routes/notifications'));
const Configurations = lazy(() => import('app/routes/configuration'));
const WaferBook = lazy(() =>
  import('app/routes/dashboard/AIPerformance/components/WaferDrawer')
);
const ScopeSelection = lazy(() => import('app/routes/ScopeSelection'));

export const publicRoutes = [
  { path: 'login', element: Login },
  { path: 'signup', element: SignUp },
  { path: 'forgotpassword', element: ForgotPassword },
  { path: 'success', element: SignupSuccess },
  { path: 'loading', element: Loading },
  { path: 'unlock', element: UnlockScreen },
  { path: 'tryDemo', element: TryDemo }
];

// export const privateRoutes = [
//   { path: 'details', element: Details },
//   // { path: '/dashboard', element: Dashboard,  // },
//   { path: 'dashboard/ai-results', element: AIResults },
// ];

export const navRoutes = [
  {
    name: 'Dashboard',
    path: 'dashboard',
    icon: DashboardIcon,
    subRoutes: [
      {
        name: 'AI Performance',
        path: 'ai-performance',
        icon: DashboardIcon,
        iconActive: DashboardIcon,
        element: AIPerformance,
        hasChildren: true,
        defaultParams: `${AI_PERFORMANCE_ROUTES.MONITORING.path}/${AI_PERFORMANCE_ROUTES.UNIT_WAFER.path}`
      }
    ]
  },
  {
    name: 'Library',
    path: 'library',
    icon: LibraryIcon,
    subRoutes: [
      {
        name: 'Data Library',
        path: 'data',
        icon: DataLibIcon,
        iconActive: DataLibIconActive,
        element: DataLibrary,
        hasChildren: true
      },
      {
        name: 'Model Library',
        path: 'model',
        icon: ModelLibIcon,
        iconActive: ModelLibIconActive,
        element: ModelLibrary
      },
      {
        name: 'Defect Library',
        path: 'defect',
        icon: DefectLibIcon,
        iconActive: DefectLibIconActive,
        element: DefectLibrary
      },
      {
        name: 'Use Case Library',
        path: 'usecase',
        icon: DefectLibIcon,
        iconActive: DefectLibIconActive,
        element: UseCaseLibrary
      }
    ]
  },
  {
    name: 'Configuration',
    path: `configuration`,
    icon: ConfigurationIcon,
    element: Configurations,
    hasChildren: true,
    defaultParams: SYSTEM_CONFIG
  },
  {
    name: 'Notifications',
    path: `notifications`,
    icon: NotificationsIcon,
    element: Notifications
  }
];

export const primaryLayoutRoutes = [
  { name: 'Scope Selection', path: '/', element: ScopeSelection },
  { name: 'Not Found', path: '*', element: ScopeSelection }
];

export const noLayoutRoutes = [
  { name: 'Review', path: 'annotation/:annotationType', element: Reviewdata },
  { name: 'Waferbook', path: 'dashboard/wafer-book', element: WaferBook },
  {
    name: 'Model Training',
    path: 'library/model',
    element: ModelTraining,
    hasChildren: true
  },
  {
    name: 'Model Library Performance',
    path: 'library/model/performance/:modelId',
    element: ModelPerformance
  },
  {
    name: 'Threshold vs performance graph',
    path: 'library/model/similarity-threshold/:modelId',
    element: SimilarityThreshold
  }
];
