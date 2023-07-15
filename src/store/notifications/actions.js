import {
  SET_NEXT_CURSOR,
  SET_NOTIFICATION_COUNT,
  SET_NOTIFICATIONS,
  SET_OLDER_NOTIFICATIONS
} from './constants';

export const setNotifications = data => {
  return { type: SET_NOTIFICATIONS, payload: data };
};

export const setOlderNotifications = data => {
  return { type: SET_OLDER_NOTIFICATIONS, payload: data };
};

export const setNextCursor = data => {
  return { type: SET_NEXT_CURSOR, payload: data };
};

export const setNotificationCount = data => {
  return { type: SET_NOTIFICATION_COUNT, payload: data };
};
