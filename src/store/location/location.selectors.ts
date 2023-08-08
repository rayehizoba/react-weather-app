import {ID, LocationResource} from "../../lib/types";
import {RootState} from "../index";

export const selectLocation = (state: RootState): null | LocationResource => state.location.model;

export const selectIsCurrentLocation = (state: RootState, id: ID) => {
  return state.location.current?.id === id;
}
