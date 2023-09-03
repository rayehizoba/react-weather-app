import React from "react";
import {AnyAction, Store} from "redux";
import {Provider} from "react-redux";
import fetchMock from "fetch-mock";
import moment from "moment-timezone";
import {faker} from "@faker-js/faker";
import {RootState, setupStore} from "../store";
import {ForecastResource, LocationResource} from "../lib/types";
import {renderHook} from "@testing-library/react-hooks";
import useForecasts from "./useForecasts";
import {objectToURLQuery} from "../lib/helpers";

function getWrapper(store: Store<any, AnyAction>): React.FC {
  return ({children}: { children?: React.ReactNode }) => (
    <Provider store={store}>{children}</Provider>
  );
}

function generateMockForecast(location: LocationResource): ForecastResource {
  const startTime = moment().tz(location.timezone).startOf('hour');
  const hourlyTime = [];
  const dailyTime = [];
  const temperature_2m = [];
  const weathercode = [];
  const windspeed_10m = [];
  const relativehumidity_2m = [];
  const temperature_2m_max = [];
  const temperature_2m_min = [];

  const mockForecast = require('../mocks/forecast-resource-mock.json');

  for (let i = 1; i < 25; i++) {
    const time = startTime.clone().add(i, 'hours').format();
    const temp = i * 10;
    const code = faker.helpers.arrayElement(mockForecast.hourly.weathercode); // Random weather code
    const windSpeed = faker.helpers.arrayElement(mockForecast.hourly.windspeed_10m); // Random wind speed
    const humidity = faker.helpers.arrayElement(mockForecast.hourly.relativehumidity_2m); // Random humidity

    hourlyTime.push(time);
    temperature_2m.push(temp);
    weathercode.push(code);
    windspeed_10m.push(windSpeed);
    relativehumidity_2m.push(humidity);
  }

  for (let i = 0; i < 7; i++) {
    const time = startTime.clone().add(i, 'days').format();
    const tempMin = faker.helpers.arrayElement(mockForecast.daily.temperature_2m_min);
    const tempMax = faker.helpers.arrayElement(mockForecast.daily.temperature_2m_max);
    const code = faker.helpers.arrayElement(mockForecast.daily.weathercode); // Random weather code

    dailyTime.push(time);
    weathercode.push(code);
    temperature_2m_max.push(tempMax);
    temperature_2m_min.push(tempMin);
  }

  return {
    ...mockForecast,
    latitude: location.latitude,
    longitude: location.longitude,
    hourly: {
      time: hourlyTime,
      temperature_2m: temperature_2m,
      weathercode: weathercode,
      windspeed_10m: windspeed_10m,
      relativehumidity_2m: relativehumidity_2m,
    },
    daily: {
      time: dailyTime,
      weathercode: weathercode,
      temperature_2m_max: temperature_2m_max,
      temperature_2m_min: temperature_2m_min,
    },
  };
}

describe('useForecasts', () => {
  let mockStore: Store;
  let wrapper: React.FC;

  beforeEach(() => {
    fetchMock.reset();
    mockStore = setupStore({} as RootState);
    wrapper = getWrapper(mockStore);
  });

  it('should fetch forecasts for multiple locations', async () => {
    const mockLocations = require("../mocks/locations-resource-mock.json");
    const mockForecasts: ForecastResource[] = [];

    mockLocations.forEach((location: LocationResource) => {
      const url = 'https://api.open-meteo.com/v1/forecast?' + objectToURLQuery({
        daily: ['weathercode', 'temperature_2m_max', 'temperature_2m_min'],
        hourly: ['temperature_2m', 'weathercode', 'windspeed_10m', 'relativehumidity_2m'],
        latitude: location.latitude,
        longitude: location.longitude,
        timezone: location.timezone,
      });
      const mockForecast = generateMockForecast(location);

      fetchMock.mock(url, mockForecast);
      mockForecasts.push(mockForecast);
    });

    const {result, waitForNextUpdate} = renderHook(
      () => useForecasts(mockLocations),
      {wrapper}
    );

    expect(result.current.forecasts).toEqual([]);

    await waitForNextUpdate();

    expect(result.current.forecasts).toEqual(mockForecasts);
  });
});
