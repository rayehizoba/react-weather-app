import React from "react";
import {render, screen, within} from "@testing-library/react";
import FavoritesList from "./FavoritesList";
import {ForecastResource, LocationResource} from "../lib/types";
import {areEqualFloats, formatHourlyTime, getTodayWeatherData, weatherCode2Str} from "../lib/helpers";
import moment from "moment-timezone";
import {faker} from "@faker-js/faker";

describe('FavoritesList', () => {
  const mockLocations = require('../mocks/locations-resource-mock.json');
  const mockForecasts = mockLocations.map(generateMockForecast);

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

  it('renders without crashing', () => {
    render(<FavoritesList locations={[]} forecasts={[]}/>);
  });

  it('displays empty state correctly', () => {
    render(<FavoritesList locations={[]} forecasts={[]}/>);

    const emptyStateElement = screen.getByText('Your favorite locations will appear here');
    expect(emptyStateElement).toBeInTheDocument();
  });

  it('displays favorite locations correctly', () => {
    render(<FavoritesList locations={mockLocations} forecasts={mockForecasts}/>);

    const emptyStateElement = screen.queryByText('Your favorite locations will appear here');
    expect(emptyStateElement).not.toBeInTheDocument();

    // Iterate through favorite locations and perform time/temperature formatting assertions
    mockLocations.forEach(async (location: LocationResource) => {
      const favoriteItemElement = screen.getByTestId(`favorites-item-${location.id}`);
      expect(favoriteItemElement).toBeInTheDocument();

      const locationElement = screen.getByText(location.name);
      expect(locationElement).toBeInTheDocument();

      const forecast = mockForecasts.find((each: ForecastResource) => {
        return location
          && areEqualFloats(each.latitude, location.latitude, 0)
          && areEqualFloats(each.longitude, location.longitude, 0);
      });
      const forecastHourly = forecast.hourly;
      const forecastHourlyUnits = forecast.hourly_units;

      const todayWeatherData = getTodayWeatherData(forecastHourly);
      const currentWeatherData = todayWeatherData[0];

      const formattedTime = formatHourlyTime(currentWeatherData.time, location.timezone, false);
      const timeElement = within(favoriteItemElement).getByText(formattedTime);
      expect(timeElement).toBeInTheDocument();

      const weatherStr = weatherCode2Str(currentWeatherData.weathercode);
      const weatherStrElement = within(favoriteItemElement).getByText(weatherStr);
      expect(weatherStrElement).toBeInTheDocument();

      const temperatureStr = currentWeatherData.temperature_2m + forecastHourlyUnits.temperature_2m;
      const temperatureElement = within(favoriteItemElement).getByText(temperatureStr);
      expect(temperatureElement).toBeInTheDocument();

      // const maxTemperature = forecastDaily.temperature_2m_max[0];
      // const minTemperature = forecastDaily.temperature_2m_min[0];
      // const tempRangeText = `${maxTemperature}°/${minTemperature}°`;
      // const tempRangeElement = await within(favoriteItemElement).findByText((content, element) => {
      //   return element?.textContent === tempRangeText;
      // });
      // expect(tempRangeElement).toBeInTheDocument();

    });
  });

  // it('displays current geolocation position correctly', () => {
  //
  //   const mockPosition: GeolocationPosition = {
  //     // @ts-ignore
  //     coords: {
  //       latitude: 123,
  //       longitude: 456,
  //     },
  //   };
  //
  //   const currentLocation = {
  //     country: '',
  //     country_code: '',
  //     country_id: '',
  //     elevation: 0,
  //     feature_code: '',
  //     id: "my-location",
  //     latitude: mockPosition.coords.latitude,
  //     longitude: mockPosition.coords.longitude,
  //     name: 'My Location',
  //     population: 1,
  //     timezone: 'auto',
  //   };
  //
  //   const mockGetCurrentPosition = jest.fn();
  //   mockGetCurrentPosition.mockImplementationOnce(
  //     (successCallback) => successCallback(mockPosition)
  //   );
  //
  //   Object.defineProperty(navigator.geolocation, 'getCurrentPosition', {
  //     value: mockGetCurrentPosition,
  //   });
  //
  //   render(<FavoritesList locations={mockLocations} forecasts={mockForecasts}/>);
  //
  //   const currentLocationElement = screen.getByText(currentLocation.name);
  //   expect(currentLocationElement).toBeInTheDocument();
  // });
});
