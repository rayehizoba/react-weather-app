import {LocationResource} from "../../lib/types";

export const types = {
  SET_LOCATION: 'LOCATION/SET_LOCATION',
  SAVE_LOCATION: 'LOCATION/SAVE_LOCATION',
  REMOVE_LOCATION: 'LOCATION/REMOVE_LOCATION',
} as const;

export interface LocationState {
  model: null | LocationResource;
}

const initialState: LocationState = {
  model: null,
};

export type Action = { type: typeof types.SET_LOCATION; data: LocationResource }
  | { type: typeof types.SAVE_LOCATION; data: LocationResource }
  | { type: typeof types.REMOVE_LOCATION; data: number };

export default function reducer(state: LocationState = initialState, action: Action): LocationState {
  switch (action.type) {
    default:
      return state;

    case types.SET_LOCATION:
      return {
        ...state,
        model: action.data,
      };
  }
}
