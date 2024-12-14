import { configureStore } from '@reduxjs/toolkit';
import fileReducer from './slices/fileSlice';

export const store = configureStore({
  reducer: {
    file: fileReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['file/setFile'],
        ignoredPaths: ['file.file'],
      },
    }),
});