import { Middleware } from '@reduxjs/toolkit';
import logger from 'redux-logger';
import { FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';

export const createMiddleware = (getDefaultMiddleware: () => Middleware[]) => {
  const middlewares = getDefaultMiddleware({
    serializableCheck: {
      ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER]
    }
  });

  if (process.env.NODE_ENV === 'development') {
    middlewares.push(logger);
  }

  return middlewares;
};
