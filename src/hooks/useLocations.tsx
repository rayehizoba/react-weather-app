import {useEffect} from "react";
import {LocationResource} from "../lib/types";
import {useDispatch, useSelector} from "react-redux";
import {
  selectLocations,
  selectLocationsFetch,
  selectLocationsFetchError,
  selectLocationsFetchSuccess
} from "../store/locations/locations.selectors";
import * as locationsActions from "../store/locations/locations.actions";

interface UseLocationsHook {
  locations: LocationResource[];
  error: Error | null;
  isLoadingLocations: boolean;
  success: boolean;
}

function useLocations(): UseLocationsHook {
  const dispatch = useDispatch();
  const locations = useSelector(selectLocations);
  const isLoadingLocations = useSelector(selectLocationsFetch);
  const success = useSelector(selectLocationsFetchSuccess);
  const error = useSelector(selectLocationsFetchError);

  useEffect(() => {
    if (!success) {
      dispatch(locationsActions.fetchLargestCities());
    }
  }, [dispatch, success]);

  return {locations, isLoadingLocations, success, error};
}

export default useLocations;
