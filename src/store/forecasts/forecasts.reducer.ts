import {ForecastResource} from "../../lib/types";
import {types as forecastTypes, Action as ForecastAction} from "../forecast/forecast.reducer";
import {mergeArraysBy} from "../../lib/helpers";

export const types = {
  FETCH_START: "FORECASTS/FETCH_START",
  FETCH_FULFILLED: "FORECASTS/FETCH_FULFILLED",
  FETCH_REJECTED: "FORECASTS/FETCH_REJECTED",
} as const;

export interface ForecastsState {
  fetch: boolean;
  fetchError: null | Error;
  fetchSuccess: boolean;
  collection: ForecastResource[];
}

const initialState: ForecastsState = {
  fetch: false,
  fetchError: null,
  fetchSuccess: false,
  collection: [],
};

type Action = { type: typeof types.FETCH_START }
  | { type: typeof types.FETCH_FULFILLED, data: ForecastResource[] }
  | { type: typeof types.FETCH_REJECTED, data: Error }
  | ForecastAction;

export default function reducer(state: ForecastsState = initialState, action: Action): ForecastsState {
  switch (action.type) {

    case types.FETCH_START:
      return {
        ...state,
        fetch: true,
        fetchError: null,
        fetchSuccess: false,
      };

    case types.FETCH_FULFILLED: {
      const collection = mergeArraysBy(
        state.collection,
        action.data,
        (forecast: ForecastResource) => `${forecast.latitude}-${forecast.longitude}`,
        (elementA, elementB) => {
          return elementA.latitude === elementB.latitude && elementA.longitude === elementB.longitude
        }
      );

      return {
        ...state,
        fetch: false,
        fetchSuccess: true,
        collection,
      };
    }

    case types.FETCH_REJECTED:
      return {
        ...state,
        fetch: false,
        fetchError: action.data,
        fetchSuccess: false,
      };

    case forecastTypes.FETCH_FULFILLED: {
      const matchingIndex = state.collection
        .findIndex(forecast => {
          return forecast.latitude === action.data.latitude && forecast.longitude === action.data.longitude;
        });

      if (matchingIndex >= 0) {
        return {
          ...state,
          collection: [
            ...state.collection.slice(0, matchingIndex),
            action.data,
            ...state.collection.slice(matchingIndex + 1)
          ]
        }
      }

      return {
        ...state,
        collection: [...state.collection, action.data]
      };
    }

    default:
      return state;
  }
}
