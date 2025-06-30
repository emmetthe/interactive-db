import { combineReducers } from 'redux';
import projectReducer from './slices/projectSlice';
// import other reducers here

const rootReducer = combineReducers({
  project: projectReducer
  // another: anotherReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
