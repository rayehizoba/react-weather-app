import {LocationResource} from "../../lib/types";
import {types as locationTypes, Action as LocationAction} from "../location/location.reducer";

export const types = {
  FETCH_START: 'LOCATIONS/FETCH_START',
  FETCH_FULFILLED: 'LOCATIONS/FETCH_FULFILLED',
  FETCH_REJECTED: 'LOCATIONS/FETCH_REJECTED',
} as const;

export interface LocationsState {
  fetch: boolean;
  fetchError: null | Error;
  fetchSuccess: boolean;
  collection: LocationResource[];
}

const initialState: LocationsState = {
  fetch: false,
  fetchSuccess: false,
  fetchError: null,
  collection: [],
};

type Action = { type: typeof types.FETCH_START; }
  | { type: typeof types.FETCH_FULFILLED; data: LocationResource[] }
  | { type: typeof types.FETCH_REJECTED; data: Error }
  | LocationAction;

export default function reducer(state: LocationsState = initialState, action: Action): LocationsState {
  switch (action.type) {
    case types.FETCH_START:
      return {
        ...state,
        fetch: true,
        fetchSuccess: false,
        fetchError: null
      };

    case types.FETCH_FULFILLED:
      return {
        ...state,
        fetch: false,
        fetchSuccess: true,
        collection: action.data,
      };

    case types.FETCH_REJECTED:
      return {
        ...state,
        fetch: false,
        fetchSuccess: false,
        fetchError: action.data
      };

    case locationTypes.SAVE_LOCATION: {
      const index = state.collection.findIndex(location => location.id === action.data.id);
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
        collection: [...state.collection, action.data],
      }
    }

    case locationTypes.REMOVE_LOCATION:
      return {
        ...state,
        collection: state.collection.filter(location => location.id !== action.data),
      };

    default:
      return state;
  }
}
