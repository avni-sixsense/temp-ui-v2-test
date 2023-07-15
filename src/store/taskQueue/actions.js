import {
  ADD_TASKS,
  CLEAR_TASKS,
  SET_ACTIVE_MODE,
  SET_IS_TASKS_RUNNING,
  SET_PENDING_TASKS_IDS,
  UPDATE_TASKS,
  ADD_NEXT_PONTER
} from './constants';

import { updateNextDataURL } from 'app/utils/helpers';

export const addTasks = data => {
  return { type: ADD_TASKS, payload: data };
};

export const addNextPointer = data => {
  return { type: ADD_NEXT_PONTER, payload: updateNextDataURL(data) };
};

export const setIsTasksRunning = data => {
  return { type: SET_IS_TASKS_RUNNING, payload: data };
};

export const setPendingTasksIds = data => {
  return { type: SET_PENDING_TASKS_IDS, payload: data };
};

export const updateTasks = data => {
  return { type: UPDATE_TASKS, payload: data };
};

export const clearTasks = () => {
  return { type: CLEAR_TASKS };
};

export const setActiveMode = data => {
  return { type: SET_ACTIVE_MODE, payload: data };
};
