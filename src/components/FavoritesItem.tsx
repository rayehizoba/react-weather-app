import React, {useEffect, useRef} from 'react';
import classNames from "classnames";
import {formatHourlyTime, getTodayWeatherData, weatherCode2Str} from "../lib/helpers";
import {ForecastResource, LocationResource} from "../lib/types";

type FavoritesItemProps = {
  forecast: ForecastResource;
  location: LocationResource;
  isActive?: boolean;
  isPeerActive?: boolean;
  isLast?: boolean;
  onClick?(location: LocationResource): void;
};

function FavoritesItem({forecast, location, isActive, isPeerActive, isLast, onClick}: FavoritesItemProps) {

  const forecastDaily = forecast.daily;
  const forecastHourly = forecast.hourly;
  const forecastHourlyUnits = forecast.hourly_units;

  const todayWeatherData = getTodayWeatherData(forecastHourly, location.timezone);
  const currentWeatherData = todayWeatherData[0];

  const weather = currentWeatherData
    ? weatherCode2Str(currentWeatherData.weathercode)
    : '-';
  const formattedTime = currentWeatherData
    ? formatHourlyTime(currentWeatherData.time, location.timezone, false)
    : '-';
  const temperature = (currentWeatherData ? currentWeatherData.temperature_2m : '--') + forecastHourlyUnits.temperature_2m;

  const minTemperature = forecastDaily.temperature_2m_min[0] + '°';
  const maxTemperature = forecastDaily.temperature_2m_max[0] + '°';
  const temperatureRange = <>
    {maxTemperature}<span className="text-slate-600">/{minTemperature}</span>
  </>;

  const targetElementRef = useRef<HTMLLIElement | null>(null);

  useEffect(() => {
    if (isActive && targetElementRef.current) {
      targetElementRef.current.scrollIntoView({ block: 'center' });
    }
  }, []);

  return (
    <li
      ref={targetElementRef}
      onClick={() => onClick && onClick(location)}
      data-testid={`favorites-item-${location.id}`}
      className={classNames(
        'cursor-pointer relative before:transition before:absolute before:-inset-0 before:-mx-3 before:-my-px before:rounded-2xl',
        !isLast && 'border-b border-slate-600',
        isActive ? 'before:bg-sky-200/25 border-transparent' : 'hover:opacity-75',
        isPeerActive && 'border-transparent',
      )}
    >
      <div className="space-y-2 py-2">
        <div className="flex justify-between">
          <div>
            <div className="font-bold text-sm">
              {location.name}
            </div>
            <div className="text-xs font-bold text-slate-500 uppercase">
              {formattedTime}
            </div>
          </div>
          <div className="text-3xl text-slate-500">
            {temperature}
          </div>
        </div>
        <div className="flex justify-between">
          <div className="font-bold text-xs text-slate-500">
            {weather}
          </div>
          <div className="font-bold text-xs text-slate-500">
            {temperatureRange}
          </div>
        </div>
      </div>
    </li>
  );
}

export default FavoritesItem;
