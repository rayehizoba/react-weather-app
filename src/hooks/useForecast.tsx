import { ForecastResource, LocationResource, QueryResult } from "../lib/types";
import { useDispatch, useSelector } from "react-redux";
import {
  selectForecast,
  selectForecastFetch,
  selectForecastFetchError,
  selectForecastFetchSuccess
} from "../store/forecast/forecast.selectors";
import { useEffect } from "react";
import * as forecastActions from "../store/forecast/forecast.actions";

function useForecast(location: LocationResource | null): QueryResult<ForecastResource | null> {
  const dispatch = useDispatch();
  const data = useSelector(selectForecast);
  const loading = useSelector(selectForecastFetch);
  const success = useSelector(selectForecastFetchSuccess);
  const error = useSelector(selectForecastFetchError);

  useEffect(() => {
    if (location) {
      dispatch(forecastActions.fetchForecast(location));
    }
  }, [dispatch, location]);

  return { data, loading, success, error };
}

export default useForecast;
