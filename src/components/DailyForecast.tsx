import React from 'react';
import classNames from "classnames";
import moment from "moment-timezone";
import {formatDailyTime, weatherCode2MDI} from "../lib/helpers";
import {ForecastResource, LocationResource} from "../lib/types";
import Card from "./Card";

interface DailyForecastProps {
  forecast: ForecastResource;
  location: LocationResource;
}

function DailyForecast({forecast, location}: DailyForecastProps) {
  const forecastDaily = forecast.daily;

  const title = forecastDaily.time.length + '-Day Forecast';
  let footer = 'Weather for ' + location.name;

  if (location.admin1) footer += ', ' + location.admin1;
  if (location.country) footer += ', ' + location.country;

  function renderDailyForecastItem(time: string, index: number) {
    const temperatureMin = forecastDaily.temperature_2m_min[index] + '°';
    const temperatureMax = forecastDaily.temperature_2m_max[index] + '°';
    return (
      <li data-testid={`daily-forecast-${index}`} key={index}>
        <Card className="bg-slate-900 p-3 !rounded-2xl">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-5">
              <i className={classNames(
                'mdi text-4xl',
                weatherCode2MDI(forecastDaily.weathercode[index])
              )}></i>
              <div className="flex items-end space-x-1">
                <div className="text-3xl leading-none">
                  {moment(time).format('D')}
                </div>
                <div className="text-xs font-semibold opacity-50">
                  {formatDailyTime(time)}
                </div>
              </div>
            </div>
            <div className="flex items-end">
              <div className="text-3xl leading-none">
                {temperatureMin}
              </div>
              <div className="text-xs font-semibold opacity-50">
                /{temperatureMax}
              </div>
            </div>
          </div>
        </Card>
      </li>
    );
  }

  return (
    <>
      <Card className='p-5 space-y-5'>
        <div className="text-3xl tracking-tight">
          {title}
        </div>
        <ul className='space-y-2'>
          {forecastDaily.time.map(renderDailyForecastItem)}
        </ul>
      </Card>
      <footer className="text-center text-slate-400 text-xs font-semibold">
        {footer}
      </footer>
    </>
  );
}

export default DailyForecast;
