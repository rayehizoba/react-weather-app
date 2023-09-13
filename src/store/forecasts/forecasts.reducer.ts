import {ForecastResource} from "../../lib/types";
import {types as forecastTypes, Action as ForecastAction} from "../forecast/forecast.reducer";

export const types = {
  FETCH_START: "FORECASTS/FETCH_START",
  FETCH_FULFILLED: "FORECASTS/FETCH_FULFILLED",
  FETCH_REJECTED: "FORECASTS/FETCH_REJECTED",
  FETCH_PROGRESS: "FORECASTS/FETCH_PROGRESS"
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
  | { type: typeof types.FETCH_PROGRESS, data: ForecastResource }
  | { type: typeof types.FETCH_FULFILLED }
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

    case types.FETCH_PROGRESS:
    case forecastTypes.FETCH_FULFILLED: {
      const updatedForecast = action.data; // The updated forecast data for a specific location

      // Find the index of the matching location forecast in the collection
      const matchingIndex = state.collection.findIndex((forecast) => {
        return forecast.latitude === updatedForecast.latitude && forecast.longitude === updatedForecast.longitude;
      });

      if (matchingIndex >= 0) {
        // Update the specific location forecast in the collection
        const updatedCollection = [
          ...state.collection.slice(0, matchingIndex),
          updatedForecast,
          ...state.collection.slice(matchingIndex + 1),
        ];

        return {
          ...state,
          collection: updatedCollection,
        };
      }

      // If the location forecast doesn't exist in the collection, add it
      return {
        ...state,
        collection: [...state.collection, updatedForecast],
      };
    }

    case types.FETCH_FULFILLED: {
      return {
        ...state,
        fetch: false,
        fetchSuccess: true,
      };
    }

    case types.FETCH_REJECTED:
      return {
        ...state,
        fetch: false,
        fetchError: action.data,
        fetchSuccess: false,
      };

    default:
      return state;
  }
}
