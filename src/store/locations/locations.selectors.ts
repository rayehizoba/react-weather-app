import { createSelector } from 'reselect';
import {ID, LocationResource} from "../../lib/types";
import {RootState} from "../index";

export const selectLocations = createSelector(
  (state: RootState) => state.location.current,
  (state: RootState) => state.locations.collection,
  (currentLocation, locations) => {
    const collection: LocationResource[] = [];

    if (currentLocation) {
      collection.push(currentLocation);
    }

    return collection.concat(
      locations.sort((a, b) => a.name.localeCompare(b.name))
    );
  }
);

export const selectLocationsFetch = (state: RootState) => state.locations.fetch;
export const selectLocationsFetchError = (state: RootState) => state.locations.fetchError;
export const selectLocationsFetchSuccess = (state: RootState) => state.locations.fetchSuccess;

export const selectIsFavoriteLocation = (state: RootState, id: ID) => {
  return state.locations.collection.findIndex(location => location.id === id) >= 0;
}
