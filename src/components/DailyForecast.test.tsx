import React from 'react';
import {render, within} from '@testing-library/react';
import {screen} from "@testing-library/react";
import DailyForecast from './DailyForecast';
import moment from "moment-timezone";
import {formatDailyTime, weatherCode2MDI} from "../lib/helpers";
import {faker} from "@faker-js/faker";
import {ForecastResource} from "../lib/types";

describe('DailyForecast', () => {
  const mockLocation = require('../mocks/location-resource-mock.json');
  const currentDay = moment().tz(mockLocation.timezone).startOf('day');
  const mockForecast = generateMockForecast(currentDay);

  function generateMockForecast(startTime: moment.Moment): ForecastResource {
    const dailyTime = [];
    const weathercode = [];
    const temperature_2m_max = [];
    const temperature_2m_min = [];

    const mockForecast = require('../mocks/forecast-resource-mock.json');

    for (let i = 0; i < 7; i++) {
      const time = startTime.clone().add(i, 'days').format();
      const tempMax = i * 10;
      const tempMin = (i * 10) / 2;
      const code = faker.helpers.arrayElement(mockForecast.daily.weathercode); // Random weather code

      dailyTime.push(time);
      weathercode.push(code);
      temperature_2m_max.push(tempMax);
      temperature_2m_min.push(tempMin);
    }

    return {
      ...mockForecast,
      daily: {
        time: dailyTime,
        weathercode: weathercode,
        temperature_2m_max: temperature_2m_max,
        temperature_2m_min: temperature_2m_min,
      },
    };
  }

  it('renders without crashing', () => {
    render(<DailyForecast forecast={mockForecast} location={mockLocation}/>);
  });

  it('renders daily forecast correctly', () => {
    render(<DailyForecast forecast={mockForecast} location={mockLocation}/>);

    const forecastDaily = mockForecast.daily;

    // Check if the component title is displayed correctly
    const titleStr = forecastDaily.time.length + '-Day Forecast';
    const titleElement = screen.getByText(titleStr);
    expect(titleElement).toBeInTheDocument();

    // Check if the forecast days are displayed correctly
    forecastDaily.time.forEach((time: string) => {
      const dayFormatted = moment(time).format('D');
      const dayElement = screen.getByText(dayFormatted);
      expect(dayElement).toBeInTheDocument();
    });

    // Check if the forecast weekdays are displayed correctly
    forecastDaily.time.forEach((time: string, index: number) => {
      const testContainer = screen.getByTestId(`daily-forecast-${index}`);
      const weekdayFormatted = formatDailyTime(time);
      const weekdayElement = within(testContainer).getByText(weekdayFormatted);
      expect(weekdayElement).toBeInTheDocument();
    });

    // Check if "Today" label is displayed for the isCurrent day
    const todayLabel = screen.getByText('Today');
    expect(todayLabel).toBeInTheDocument();

    // Check if weather icons are displayed correctly
    const weatherIcons = forecastDaily.weathercode.map(weatherCode2MDI);
    weatherIcons.forEach((icon: string, index: number) => {
      const testContainer = screen.getByTestId(`daily-forecast-${index}`);
      const mdiIcon = within(testContainer).getByText('', {selector: `.${icon}`});
      expect(mdiIcon).toBeInTheDocument();
    });

    // Check if temperature ranges are displayed correctly
    // forecastDaily.temperature_2m_min.forEach(async (minTemp: number, index: number) => {
    //   const testContainer = screen.getByTestId(`daily-forecast-${index}`);
    //   const tempRangeText = `${minTemp}° / ${forecastDaily.temperature_2m_max[index]}°`;
    //   const tempRangeElement = await within(testContainer).findByText((_, element) => element?.textContent === tempRangeText);
    //   expect(tempRangeElement).toBeInTheDocument();
    // });

    // Check if location information is displayed correctly in the footer
    const locationFooter = screen.getByText(`Weather for ${mockLocation.name}, ${mockLocation.country}`);
    expect(locationFooter).toBeInTheDocument();
  });
});
