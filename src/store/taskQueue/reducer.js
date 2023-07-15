import { keyBy } from 'lodash';
import initialState from 'store/constants/initial';

import * as t from './constants';

function addTasks(state, payload) {
  const { data, isNew } = payload;

  if (isNew) {
    return {
      ...state,
      tasks: data
    };
  }
  return {
    ...state,
    tasks: [...state.tasks, ...data]
  };
}

function setPendingTasksIds(state, payload) {
  return {
    ...state,
    pendingStatusIds: payload
  };
}

function addNextPointer(state, payload) {
  return {
    ...state,
    nextPointer: payload
  };
}

function updateTasks(state, payload) {
  const dict = keyBy(state.tasks, 'task_id');
  const newTasks = keyBy(payload, 'task_id');

  return {
    ...state,
    tasks: Object.values({ ...dict, ...newTasks })
  };
}

function clearTasks() {
  return {
    tasks: [],
    pendingStatusIds: []
  };
}

function setActiveMode(state, payload) {
  return {
    ...state,
    activeMode: payload
  };
}

export default function (state = initialState.taskQueue, action) {
  switch (action.type) {
    case t.ADD_TASKS:
      return addTasks(state, action.payload);
    case t.ADD_NEXT_PONTER:
      return addNextPointer(state, action.payload);
    case t.SET_PENDING_TASKS_IDS:
      return setPendingTasksIds(state, action.payload);
    case t.UPDATE_TASKS:
      return updateTasks(state, action.payload);
    case t.CLEAR_TASKS:
      return clearTasks();
    case t.SET_ACTIVE_MODE:
      return setActiveMode(state, action.payload);
    default:
      return state;
  }
}
