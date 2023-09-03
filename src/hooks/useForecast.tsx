import {ForecastResource, LocationResource} from "../lib/types";
import {useDispatch, useSelector} from "react-redux";
import {
  selectForecast,
  selectForecastFetch,
  selectForecastFetchError,
  selectForecastFetchSuccess
} from "../store/forecast/forecast.selectors";
import {useEffect} from "react";
import * as forecastActions from "../store/forecast/forecast.actions";

interface UseForecastHook {
  forecast: ForecastResource | null;
  error: null | object;
  isLoadingForecast: boolean;
  success: boolean;
}

function useForecast(location: LocationResource | null): UseForecastHook {
  const dispatch = useDispatch();
  const forecast = useSelector(selectForecast);
  const isLoadingForecast = useSelector(selectForecastFetch);
  const success = useSelector(selectForecastFetchSuccess);
  const error = useSelector(selectForecastFetchError);

  useEffect(() => {
    if (location) {
      dispatch(forecastActions.fetchForecast(location));
    }
  }, [dispatch, location]);

  return {forecast, isLoadingForecast, success, error};
}

export default useForecast;
