import {types} from "./location.reducer";
import {ActionType, LocationResource} from "../../lib/types";
import {Dispatch} from "redux";

/**
 *
 * @returns {Function}
 */
export const setLocation = (data: LocationResource): any => {
  return (dispatch: Dispatch<ActionType<LocationResource>>) => {
    dispatch({type: types.SET_LOCATION, data});
  }
};

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
export const removeLocation = (id: number): any => {
  return (dispatch: Dispatch<ActionType<number>>) => {
    dispatch({type: types.REMOVE_LOCATION, data: id});
  }
};
