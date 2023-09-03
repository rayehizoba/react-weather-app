import {useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {selectForecasts} from "../store/forecasts/forecasts.selectors";
import * as forecastActions from "../store/forecast/forecast.actions";
import {ForecastResource, LocationResource} from "../lib/types";

interface UseForecastsHook {
  forecasts: ForecastResource[]
}

function useForecasts(locations: LocationResource[]): UseForecastsHook {
  const dispatch = useDispatch();
  const forecasts = useSelector(selectForecasts);

  useEffect(() => {
    fetchForecasts();
  }, []);

  async function fetchForecasts() {
    const promises = locations.map(location => {
      return dispatch(forecastActions.fetchForecast(location));
    });
    await Promise.all(promises);
  }

  return {forecasts};
}

export default useForecasts;
