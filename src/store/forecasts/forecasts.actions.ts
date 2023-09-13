import {Dispatch} from "redux";
import {types} from "./forecasts.reducer";
import {getTimezone, objectToURLQuery} from "../../lib/helpers";
import {ActionType, ForecastResource, LocationResource} from "../../lib/types";

export const fetchForecasts = (locations: LocationResource[]): any => {
  return async (dispatch: Dispatch<ActionType<ForecastResource[]>>) => {
    dispatch({type: types.FETCH_START});

    try {
      for (const location of locations) {
        const url = 'https://api.open-meteo.com/v1/forecast?' + objectToURLQuery({
          daily: ['weathercode', 'temperature_2m_max', 'temperature_2m_min'],
          hourly: ['temperature_2m', 'weathercode', 'windspeed_10m', 'relativehumidity_2m'],
          latitude: location.latitude,
          longitude: location.longitude,
          timezone: location.timezone || getTimezone(),
        });
        const response = await fetch(url);
        const data = await response.json();
        dispatch({ type: types.FETCH_PROGRESS, data });
      }
      dispatch({type: types.FETCH_FULFILLED});
    } catch (error: any) {
      dispatch({type: types.FETCH_REJECTED, data: error});
    }
  };
}
