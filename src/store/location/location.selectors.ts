import {LocationResource} from "../../lib/types";
import {RootState} from "../index";

export const selectLocation = (state: RootState): null | LocationResource => state.location.model;
