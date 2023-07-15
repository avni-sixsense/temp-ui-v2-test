import { keyBy, orderBy, sortBy } from 'lodash';
import initialState from 'store/constants/initial';

import * as t from './constants';

function setNotifications(state, payload) {
  const dict = keyBy([...payload, ...state.data], 'id');
  const sortedData = orderBy(Object.values(dict), ['created_ts'], ['desc']);
  return {
    ...state,
    data: sortedData
  };
}

function setNotificationCount(state, payload) {
  return {
    ...state,
    total: payload?.total || 0,
    read: payload?.is_read || 0,
    unread: payload?.is_unread || 0
  };
}

function setNextCursor(state, payload) {
  return {
    ...state,
    next: payload
  };
}

function setOlderNotifications(state, payload) {
  const dict = keyBy([...state.data, ...payload], 'id');
  const sortedData = orderBy(Object.values(dict), ['created_ts'], ['desc']);
  return {
    ...state,
    data: sortedData
  };
}

export default function (state = initialState.notifications, action) {
  switch (action.type) {
    case t.SET_NOTIFICATIONS:
      return setNotifications(state, action.payload);
    case t.SET_NOTIFICATION_COUNT:
      return setNotificationCount(state, action.payload);
    case t.SET_NEXT_CURSOR:
      return setNextCursor(state, action.payload);
    case t.SET_OLDER_NOTIFICATIONS:
      return setOlderNotifications(state, action.payload);
    default:
      return state;
  }
}
