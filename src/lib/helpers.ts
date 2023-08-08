import {FormEvent, FormEventHandler, MouseEventHandler} from "react";
import {LocationResource, NoteData, NoteResource} from "./types";

/**
 *
 * @param params
 */
export function objectToURLQuery(params: { [key: string]: any } = {}): string {
  let arResult: string[] = [];
  Object.keys(params).forEach(key => {
    if (params[key] !== null) {
      arResult.push(key + "=" + params[key]);
    }
  });
  return arResult.join("&");
}

/**
 *
 * @param code
 */
export function weatherCode2MDI(code?: number): null | string {
  switch (code) {
    case 0:
      // Clear sky
      return 'mdi-weather-sunny';

    case 1:
    case 2:
    case 3:
      // Mainly clear, partly cloudy, and overcast
      return 'mdi-weather-partly-cloudy';

    case 45:
    case 48:
      // Fog and depositing rime fog
      return 'mdi-weather-fog';

    case 51:
    case 53:
    case 55:
      // Drizzle: Light, moderate, and dense intensity
      return 'mdi-weather-partly-rainy';

    case 56:
    case 57:
      // Freezing Drizzle: Light and dense intensity
      return 'mdi-weather-partly-snowy-rainy';

    case 61:
    case 63:
    case 65:
      // Rain: Slight, moderate and heavy intensity
      return 'mdi-weather-rainy';

    case 66:
    case 67:
      // Freezing Rain: Light and heavy intensity
      return 'mdi-weather-snowy-rainy';

    case 71:
    case 73:
    case 75:
      // Snow fall: Slight, moderate, and heavy intensity
      return 'mdi-weather-snowy-heavy';

    case 77:
      // Snow grains
      return 'mdi-weather-partly-snowy';

    case 80:
    case 81:
    case 82:
      // Rain showers: Slight, moderate, and violent
      return 'mdi-weather-pouring';

    case 85:
    case 86:
      // Snow showers slight and heavy
      return 'mdi-weather-snowy';

    case 95:
      // Thunderstorm: Slight or moderate
      return 'mdi-weather-lightning-rainy';

    case 96:
    case 99:
      // Thunderstorm with slight and heavy hail
      return 'mdi-weather-hail';

    default:
      return null;
  }
}

/**
 *
 * @param code
 */
export function weatherCode2LottieJSON(code?: number): string {
  switch (code) {
    case 0:
      return require('../assets/json/clear_sky.json');

    case 1:
    case 2:
    case 3:
      return require('../assets/json/partly_cloudy.json');

    case 45:
    case 48:
      return require('../assets/json/fog.json');

    case 51:
    case 53:
    case 55:
    case 56:
    case 57:
      return require('../assets/json/drizzle.json');

    case 61:
    case 63:
    case 65:
    case 66:
    case 67:
      return require('../assets/json/rain.json');

    case 71:
    case 73:
    case 75:
    case 77:
      return require('../assets/json/snow_fall.json');

    case 80:
    case 81:
    case 82:
      return require('../assets/json/rain.json');

    case 85:
    case 86:
      return require('../assets/json/snow_showers.json');

    case 95:
      return require('../assets/json/thunderstorm.json');

    case 96:
    case 99:
      return require('../assets/json/hail.json');

    default:
      return require('../assets/json/cloud.json');
  }
}

/**
 *
 * @param code
 */
export function weatherCode2Str(code?: number): null | string {
  switch (code) {
    case 0:
      return 'Clear sky';

    case 1:
    case 2:
    case 3:
      return 'Partly cloudy';

    case 45:
    case 48:
      return 'Fog';

    case 51:
    case 53:
    case 55:
      return 'Drizzle';

    case 56:
    case 57:
      return 'Freezing Drizzle';

    case 61:
    case 63:
    case 65:
      return 'Rain';

    case 66:
    case 67:
      return 'Freezing Rain';

    case 71:
    case 73:
    case 75:
      return 'Snow fall';

    case 77:
      return 'Snow grains';

    case 80:
    case 81:
    case 82:
      return 'Rain showers';

    case 85:
    case 86:
      return 'Snow showers';

    case 95:
      return 'Thunderstorm';

    case 96:
    case 99:
      return 'Thunderstorm with hail';

    default:
      return null;
  }
}

/**
 *
 */
export function getTimezone(): string {
  const now = new Date();
  return now.toLocaleString('en-US', {timeZoneName: 'short'}).split(' ').pop() ?? 'auto';
}

/**
 *
 * @param fn
 * @returns {Function}
 */
export const preventDefault = (fn: (event: FormEvent<HTMLFormElement>) => void): FormEventHandler<HTMLFormElement> => (event: FormEvent<HTMLFormElement>) => {
  event.preventDefault();
  fn(event);
};

/**
 *
 * @param fn
 * @returns {Function}
 */
export const stopPropagation = (fn: Function): MouseEventHandler<HTMLButtonElement> => (event) => {
  event.stopPropagation();
  fn(event);
};

/**
 *
 */
function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = Math.random() * 16 | 0,
      // eslint-disable-next-line no-mixed-operators
      v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

/**
 *
 * @param noteData
 */
export const createNoteResource = (noteData: NoteData): NoteResource => {
  return {
    id: generateUUID(),
    created_at: Date.now(),
    updated_at: Date.now(),
    ...noteData,
  }
}

/**
 *
 * @param a
 * @param b
 * @param precision
 */
export function areEqualFloats(a: number, b: number, precision = 2) {
  const tolerance = 10 ** (-precision);
  return Math.abs(a - b) < tolerance;
}

/**
 *
 * @param coords
 */
export function currentLocationResource(coords: GeolocationCoordinates): LocationResource {
  return {
    country: '',
    country_code: '',
    country_id: generateUUID(),
    elevation: 0,
    feature_code: '',
    id: "CURRENT_LOCATION",
    latitude: coords.latitude,
    longitude: coords.longitude,
    name: 'My Location',
    population: 1,
    timezone: getTimezone(),
  }
}
