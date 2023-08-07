import {ForecastResource} from "../../lib/types";
import {types as forecastTypes, Action as ForecastAction} from "../forecast/forecast.reducer";

export const types = {} as const;

export interface ForecastsState {
  collection: ForecastResource[];
}

const initialState: ForecastsState = {
  collection: [],
};

type Action = ForecastAction;

export default function reducer(state: ForecastsState = initialState, action: Action): ForecastsState {
  switch (action.type) {

    case forecastTypes.FETCH_FULFILLED: {
      const index = state.collection.findIndex(forecast => {
        return forecast.latitude === action.data.latitude && forecast.longitude === action.data.longitude;
      });

      if (index >= 0) {
        return {
          ...state,
          collection: [
            ...state.collection.slice(0, index),
            action.data,
            ...state.collection.slice(index+1)
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
