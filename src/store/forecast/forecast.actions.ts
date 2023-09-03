import {Dispatch} from "redux";
import {types} from "./forecast.reducer";
import {ActionType, ForecastResource, LocationResource} from "../../lib/types";
import {getTimezone, objectToURLQuery} from "../../lib/helpers";

/**
 *
 * @param location
 */
export const fetchForecast = (location: LocationResource): any => {
  return (dispatch: Dispatch<ActionType<ForecastResource>>) => {

    dispatch({type: types.FETCH_START});

    const url = 'https://api.open-meteo.com/v1/forecast?' + objectToURLQuery({
      daily: ['weathercode', 'temperature_2m_max', 'temperature_2m_min'],
      hourly: ['temperature_2m', 'weathercode', 'windspeed_10m', 'relativehumidity_2m'],
      latitude: location.latitude,
      longitude: location.longitude,
      timezone: location.timezone || getTimezone(),
    });

    fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data: ForecastResource) => {
        dispatch({type: types.FETCH_FULFILLED, data});
      })
      .catch((error) => {
        dispatch({type: types.FETCH_REJECTED, data: error});
      });
  };
}
