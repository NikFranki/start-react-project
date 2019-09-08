// src/store/index.ts
import { combineReducers } from 'redux';

import { homeReducer } from './home/reducers';

const rootReducer = combineReducers({
    home: homeReducer
});

export default rootReducer;

export type AppState = ReturnType<typeof rootReducer>