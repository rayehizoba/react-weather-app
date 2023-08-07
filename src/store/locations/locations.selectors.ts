import {LocationResource} from "../../lib/types";
import {RootState} from "../index";

export const selectLocations = (state: RootState): LocationResource[] => state.locations.collection;
