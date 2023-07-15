import { applyMiddleware, compose, createStore } from 'redux';
import thunk from 'redux-thunk';
import rootReducer from './rootReducer';
import { useDispatch } from 'react-redux';

declare global {
  interface Window {
    __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: typeof compose;
  }
}

const isProduction = process.env.NODE_ENV === 'production';

const composeEnhancers =
  (!isProduction &&
    typeof window !== 'undefined' &&
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) ||
  compose;

const middlerwares = [thunk];

const store = createStore(
  rootReducer,
  composeEnhancers(applyMiddleware(...middlerwares))
);

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch: () => AppDispatch = useDispatch;

export default store;
