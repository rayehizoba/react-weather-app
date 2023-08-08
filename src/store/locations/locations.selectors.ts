import {ID, LocationResource} from "../../lib/types";
import {RootState} from "../index";

export const selectLocations = (state: RootState): LocationResource[] => {
  const locations: LocationResource[] = [];

  if (state.location.current) {
    locations.push(state.location.current);
  }

  return locations.concat(
    state.locations.collection.sort((a, b) => a.name.localeCompare(b.name))
  );
}

export const selectIsFavoriteLocation = (state: RootState, id: ID) => {
  return state.locations.collection.findIndex(location => location.id === id) >= 0;
}
