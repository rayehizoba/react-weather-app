import {types} from "./location.reducer";
import {ActionType, ID, LocationResource} from "../../lib/types";
import {Dispatch} from "redux";

/**
 *
 * @returns {Function}
 */
export const setLocation = (data: LocationResource | null): any => {
  return (dispatch: Dispatch<ActionType<LocationResource | null>>) => {
    dispatch({type: types.SET_LOCATION, data});
  }
};

/**
 *
 * @param data
 */
export const setCurrentLocation = (data: LocationResource): any => {
  return (dispatch: Dispatch<ActionType<LocationResource>>) => {
    dispatch({type: types.CURRENT_LOCATION, data});
  }
}

/**
 *
 * @returns {Function}
 */
export const saveLocation = (data: LocationResource): any => {
  return (dispatch: Dispatch<ActionType<LocationResource>>) => {
    dispatch({type: types.SAVE_LOCATION, data});
  }
};

/**
 *
 * @returns {Function}
 */
export const removeLocation = (id: ID): any => {
  return (dispatch: Dispatch<ActionType<ID>>) => {
    dispatch({type: types.REMOVE_LOCATION, data: id});
  }
};
