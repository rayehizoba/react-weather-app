import thunk from 'redux-thunk';
import {applyMiddleware, combineReducers, createStore} from 'redux';
import {persistStore, persistReducer} from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import location from './location/location.reducer';
import locations from './locations/locations.reducer';
import note from './note/note.reducer';
import notes from './notes/notes.reducer';
import forecast from './forecast/forecast.reducer';
import forecasts from './forecasts/forecasts.reducer';

const reducers = combineReducers({
  forecast,
  forecasts,
  location,
  locations,
  note,
  notes,
});

const persistConfig = {
  key: 'root',
  storage,
  // blacklist: [],
  // whitelist: [],
};

const persistedReducer = persistReducer(persistConfig, reducers);

const middlewareComponents = [
  thunk,
];

if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
  const { logger } = require(`redux-logger`);
  middlewareComponents.push(logger);
}

const middleware = applyMiddleware(...middlewareComponents);

const store = createStore(persistedReducer, middleware);

export const persistor = persistStore(store);

export default store;

export type RootState = ReturnType<typeof reducers>
export type AppStore = ReturnType<typeof setupStore>
export type AppDispatch = typeof store.dispatch

export const setupStore = (preloadedState: RootState) => {
  return createStore(reducers, preloadedState, middleware);
};
