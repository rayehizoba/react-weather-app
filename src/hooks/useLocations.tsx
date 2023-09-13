import {useEffect} from "react";
import {LocationResource, QueryResult} from "../lib/types";
import {useDispatch, useSelector} from "react-redux";
import {selectLocations, selectLocationsFetch, selectLocationsFetchError, selectLocationsFetchSuccess} from "../store/locations/locations.selectors";
import * as locationsActions from "../store/locations/locations.actions";

function useLocations(): QueryResult<LocationResource[]> {
  const dispatch = useDispatch();
  const data = useSelector(selectLocations);
  const loading = useSelector(selectLocationsFetch);
  const success = useSelector(selectLocationsFetchSuccess);
  const error = useSelector(selectLocationsFetchError);

  useEffect(() => {
    if (!success) {
      dispatch(locationsActions.fetchLargestCities());
    }
  }, [dispatch, success]);

  return {data, loading, success, error};
}

export default useLocations;
