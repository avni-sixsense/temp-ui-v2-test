import { refreshToken } from 'app/utils/refreshToken';
import { publicRoutes } from 'app/configs/routes';
import Axios from 'axios';
import { toast } from 'react-toastify';
import BACKEND_URL from 'store/constants/urls';
import store from 'store/index';
import { isWindow } from 'app/utils';

const axios = Axios.create({ baseURL: BACKEND_URL });

let refreshingToken = null;

axios.interceptors.request.use(request => {
  const { user } = store.getState();

  let isAuthenticatedRoute;

  if (isWindow()) {
    const { pathname } = window.location;
    isAuthenticatedRoute = !publicRoutes.some(route =>
      pathname.includes(route.path)
    );
  } else {
    isAuthenticatedRoute = true;
  }

  if (isAuthenticatedRoute) {
    axios.defaults.withCredentials = true;
    request.headers.Authorization = `Bearer ${user.accessToken}`;
  } else {
    axios.defaults.withCredentials = false;
  }

  return request;
});

axios.interceptors.response.use(
  response => response,
  async error => {
    const { config } = error;

    if (!config.url.includes('users/refresh_token')) {
      if (error?.response?.status === 403) {
        toast('You are not allowed to access this page.');
      } else if (
        error.response.data?.code === 'token_not_valid' &&
        !config._retry
      ) {
        config._retry = true;
        refreshingToken = refreshingToken ? refreshingToken : refreshToken();

        const token = await refreshingToken;
        refreshingToken = null;

        axios.defaults.headers.Authorization = `Bearer ${token}`;
        return axios(config);
      }
    }

    return Promise.reject(error);
  }
);

export default axios;
