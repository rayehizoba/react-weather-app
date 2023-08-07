import {ForecastResource} from "../../lib/types";
import {types as appTypes, Action as AppAction} from '../app/app.reducer';

export const types = {
  FETCH_START: "FORECAST/FETCH_START",
  FETCH_FULFILLED: "FORECAST/FETCH_FULFILLED",
  FETCH_REJECTED: "FORECAST/FETCH_REJECTED",
} as const;

export interface ForeCastState {
  fetch: boolean;
  fetchError: null | Error;
  fetchSuccess: boolean;
  model: null | ForecastResource;
}

const initialState: ForeCastState = {
  fetch: false,
  fetchError: null,
  fetchSuccess: false,
  model: null,
};

export type Action = { type: typeof types.FETCH_START }
  | { type: typeof types.FETCH_FULFILLED, data: ForecastResource }
  | { type: typeof types.FETCH_REJECTED, data: Error }
  | AppAction;

export default function reducer(state: ForeCastState = initialState, action: Action): ForeCastState {
  switch (action.type) {
    default:
      return state;

    case types.FETCH_START:
      return {
        ...state,
        fetch: true,
        fetchError: null,
        fetchSuccess: false,
      };

    case types.FETCH_FULFILLED:
      return {
        ...state,
        fetch: false,
        fetchSuccess: true,
        model: action.data,
      };

    case types.FETCH_REJECTED:
      return {
        ...state,
        fetch: false,
        fetchError: action.data,
        fetchSuccess: false,
      };

    case appTypes.CLEAR_ERRORS:
      return {
        ...initialState,
      };
  }
}
