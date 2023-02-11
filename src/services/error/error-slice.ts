import { createSlice } from '@reduxjs/toolkit';

type TInitialState = {
  errors: Record<string, string>;
};

const initialState: TInitialState = {
  errors: {}
};

export const errorSlice = createSlice({
  name: 'error',
  initialState,
  reducers: {
    setErrors: (state, action) => {
      state.errors = action.payload;
    },
    clearErrors: (state) => {
      state.errors = {};
    }
  }
});

export const { setErrors, clearErrors } = errorSlice.actions;

export const selectorErrors = (state: { error: TInitialState }) => state.error;

export default errorSlice.reducer;
