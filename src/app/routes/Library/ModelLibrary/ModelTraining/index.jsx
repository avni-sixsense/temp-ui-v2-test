import { lazy, useEffect } from 'react';
import { Routes } from 'react-router-dom';

import { CssBaseline, ThemeProvider } from '@material-ui/core';
import reviewTheme from 'app/configs/reviewTheme';

import store from 'store';

import { resetModelTraining } from 'store/modelTraining/actions';

import { renderRoute } from 'app/services/Routing';

const CreateModel = lazy(() => import('./CreateModel'));
const ResumeModel = lazy(() => import('./ResumeModel'));
const RetrainModel = lazy(() => import('./RetrainModel'));
const TrainingData = lazy(() => import('./TrainingData'));
const TrainingConfiguration = lazy(() => import('./TrainingConfiguration'));
const TrainingOverview = lazy(() => import('./TrainingOverview'));
const TrainingProgress = lazy(() => import('./TrainingProgress'));

const routes = [
  { name: 'Create New Model', path: 'create', element: CreateModel },
  {
    name: 'Resume Model Training',
    path: 'resume/:trainingSessionId',
    element: ResumeModel
  },
  {
    name: 'Re-train Model',
    path: 'retrain/:oldModelId',
    element: RetrainModel
  },
  {
    name: 'Train Model',
    path: 'training-data/:trainingSessionId',
    element: TrainingData
  },
  {
    name: 'Training Configurations',
    path: 'training-configuration/:trainingSessionId',
    element: TrainingConfiguration
  },
  {
    name: 'Training Overview',
    path: 'training-overview/:trainingSessionId',
    element: TrainingOverview
  },
  {
    name: 'Training Progress',
    path: 'training-progress/:trainingSessionId',
    element: TrainingProgress
  }
];

const ModelTraining = () => {
  useEffect(() => {
    return () => {
      store.dispatch(resetModelTraining());
    };
  }, []);

  return (
    <ThemeProvider theme={reviewTheme}>
      <CssBaseline />

      <Routes>{routes.map(renderRoute)}</Routes>
    </ThemeProvider>
  );
};

export default ModelTraining;
