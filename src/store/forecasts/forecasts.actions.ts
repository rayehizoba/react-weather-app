import {Dispatch} from "redux";
import {types} from "./forecasts.reducer";
import {getTimezone, objectToURLQuery} from "../../lib/helpers";
import {ActionType, ForecastResource, LocationResource} from "../../lib/types";

export const fetchForecasts = (locations: LocationResource[]): any => {
  return async (dispatch: Dispatch<ActionType<ForecastResource[]>>) => {
    dispatch({type: types.FETCH_START});

    const forecasts: ForecastResource[] = [];
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
        forecasts.push(data);
      }
      dispatch({type: types.FETCH_FULFILLED, data: forecasts});
    } catch (error: any) {
      dispatch({type: types.FETCH_REJECTED, data: error});
    }

    // const url = 'https://api.open-meteo.com/v1/forecast?' + objectToURLQuery({
    //   daily: ['weathercode', 'temperature_2m_max', 'temperature_2m_min'],
    //   hourly: ['temperature_2m', 'weathercode', 'windspeed_10m', 'relativehumidity_2m'],
    //   latitude: location.latitude,
    //   longitude: location.longitude,
    //   timezone: location.timezone || getTimezone(),
    // });
    //
    // return fetch(url)
    //   .then((response) => {
    //     if (!response.ok) {
    //       throw new Error('Network response was not ok');
    //     }
    //     return response.json();
    //   })
    //   .then((data: ForecastResource) => {
    //     dispatch({type: types.FETCH_FULFILLED, data});
    //   })
    //   .catch((error) => {
    //     dispatch({type: types.FETCH_REJECTED, data: error});
    //   });
  };
}
