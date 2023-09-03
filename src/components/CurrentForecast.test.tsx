import React from "react";
import {render, within} from '@testing-library/react';
import CurrentForecast from "./CurrentForecast";
import {screen} from "@testing-library/react";
import {
  formatHourlyTime,
  getTodayWeatherData,
  weatherCode2MDI,
  weatherCode2Str
} from "../lib/helpers";
import moment from "moment-timezone";
import {faker} from "@faker-js/faker";
import {ForecastResource} from "../lib/types";

describe('CurrentForecast', () => {
  const mockLocation = require('../mocks/location-resource-mock.json');
  const currentHour = moment().tz(mockLocation.timezone).startOf('hour');
  const mockForecast = generateMockForecast(currentHour);

  function generateMockForecast(startTime: moment.Moment): ForecastResource {
    const hourlyTime = [];
    const temperature_2m = [];
    const weathercode = [];
    const windspeed_10m = [];
    const relativehumidity_2m = [];

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

    return {
      ...mockForecast,
      hourly: {
        time: hourlyTime,
        temperature_2m: temperature_2m,
        weathercode: weathercode,
        windspeed_10m: windspeed_10m,
        relativehumidity_2m: relativehumidity_2m,
      },
    };
  }

  it('renders without crashing', () => {
    render(<CurrentForecast forecast={mockForecast} location={mockLocation}/>);
  });

  it('displays location name correctly', () => {
    render(<CurrentForecast forecast={mockForecast} location={mockLocation}/>);

    const locationNameElement = screen.getByText(mockLocation.name);
    expect(locationNameElement).toBeInTheDocument();
  });

  it('displays current weather information correctly', async () => {
    render(<CurrentForecast forecast={mockForecast} location={mockLocation}/>);

    const testContainer = screen.getByTestId('current-forecast');

    const todayWeatherData = getTodayWeatherData(mockForecast.hourly);
    const currentWeatherData = todayWeatherData[0];
    const hourlyUnits = mockForecast.hourly_units;

    const weatherStr = weatherCode2Str(currentWeatherData.weathercode);
    const weatherStrElement = within(testContainer).getByText(weatherStr);
    expect(weatherStrElement).toBeInTheDocument();

    const temperatureStr = currentWeatherData.temperature_2m + hourlyUnits.temperature_2m;
    const temperatureElement = within(testContainer).getByText(temperatureStr);
    expect(temperatureElement).toBeInTheDocument();

    const humidityStr = currentWeatherData.relativehumidity_2m + hourlyUnits.relativehumidity_2m;
    const humidityElement = await within(testContainer).findByText((_, element) => element?.textContent === humidityStr);
    expect(humidityElement).toBeInTheDocument();

    const windSpeedStr = currentWeatherData.windspeed_10m + hourlyUnits.windspeed_10m;
    const windSpeedElement = await within(testContainer).findByText((_, element) => element?.textContent === windSpeedStr);
    expect(windSpeedElement).toBeInTheDocument();
  });

  it('formats today\'s hourly forecast correctly', () => {
    render(<CurrentForecast forecast={mockForecast} location={mockLocation}/>);

    const todayWeatherData = getTodayWeatherData(mockForecast.hourly);
    const hourlyUnits = mockForecast.hourly_units;

    // Iterate through hourly forecast locations and perform time formatting assertions
    todayWeatherData.forEach(({time, temperature_2m, weathercode}, index) => {
      const testContainer = screen.getByTestId(`hourly-forecast-${index}`);

      const formattedTime = formatHourlyTime(time, mockLocation.timezone);
      const timeElement = within(testContainer).getByText(formattedTime);
      expect(timeElement).toBeInTheDocument();

      const temperatureStr = temperature_2m + hourlyUnits.temperature_2m;
      const temperatureElement = within(testContainer).getByText(temperatureStr);
      expect(temperatureElement).toBeInTheDocument();

      const weatherIconName = weatherCode2MDI(weathercode);
      const weatherIconElement = within(testContainer).getByText('', { selector: `.${weatherIconName}` });
      expect(weatherIconElement).toBeInTheDocument();
    });
  });
});
