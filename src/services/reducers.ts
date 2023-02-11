import { combineReducers } from 'redux';
import errorReducer from './error';
import postReducer from './post';
import snackbarReducer from './snackbar';

export const appReducer = combineReducers({
  error: errorReducer,
  post: postReducer,
  snackbar: snackbarReducer
});

export const rootReducer = (
  state: ReturnType<typeof appReducer> | undefined,
  action: any
) => {
  return appReducer(state, action);
};

export type RootState = ReturnType<typeof rootReducer>;
