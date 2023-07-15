import axios from 'app/api/base';
import { logout } from 'app/utils/helpers';
import store from 'store/index';
import IndexedDbService from 'app/services/IndexedDbService';
import { isWindow } from '.';

export const refreshToken = async () => {
  try {
    let res;

    if (process.env.REACT_APP_USE_AUTH_COOKIES === 'true') {
      const { refresh } = await IndexedDbService.getToken();
      res = await axios.post('/api/v1/users/refresh_token/', { refresh });
      await IndexedDbService.setToken(res.data.refresh);
    } else {
      res = await axios.post('/api/v1/users/refresh_token/');
    }

    const accessToken = res.data.access;
    store.dispatch({ type: 'SET_TOKEN', payload: accessToken });

    return Promise.resolve(accessToken);
  } catch (err) {
    logout();

    if (isWindow() && !window.location.pathname.includes('login')) {
      window.location.href = '/login';
    }

    return Promise.reject(err);
  }
};
