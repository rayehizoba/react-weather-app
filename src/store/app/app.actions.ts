import {types} from "./app.reducer";
import {Dispatch} from "redux";
import {ActionType} from "../../lib/types";

export const clearErrors = () => {
  return (dispatch: Dispatch<ActionType<null>>) => {
    dispatch({type: types.CLEAR_ERRORS});
  }
};
