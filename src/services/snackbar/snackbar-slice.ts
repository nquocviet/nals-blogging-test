import { createSlice } from '@reduxjs/toolkit';

type TSnackbar = {
  id: number;
  message: string;
};

type TInitialState = {
  snackbars: TSnackbar[];
};

const initialState: TInitialState = {
  snackbars: []
};

let id = 0;

export const snackbarSlice = createSlice({
  name: 'snackbar',
  initialState,
  reducers: {
    addSnackbar: (state, action) => {
      console.log(action.payload);

      const nextId = ++id;
      const snackbar = {
        id: nextId,
        message: action.payload
      };

      state.snackbars = [snackbar, ...state.snackbars];
    },
    removeSnackbar: (state, action) => {
      state.snackbars = state.snackbars.filter(
        ({ id }) => id !== action.payload
      );
    }
  }
});

export const { addSnackbar, removeSnackbar } = snackbarSlice.actions;

export const selectorSnackbars = (state: { snackbar: TInitialState }) =>
  state.snackbar;

export default snackbarSlice.reducer;
