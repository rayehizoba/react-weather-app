import React from 'react';
import Lottie from "react-lottie";
import classNames from "classnames";
import {ForecastResource, LocationResource, WeatherData} from "../lib/types";
import {
  formatHourlyTime,
  getTodayWeatherData,
  weatherCode2LottieJSON,
  weatherCode2MDI,
  weatherCode2Str
} from "../lib/helpers";
import Card from "./Card";

interface CurrentForecastProps {
  forecast: ForecastResource;
  location: LocationResource;
}

function CurrentForecast({forecast, location}: CurrentForecastProps) {
  const forecastHourly = forecast.hourly;
  const forecastHourlyUnits = forecast.hourly_units;

  const unitTemperature = forecastHourlyUnits.temperature_2m;
  const unitHumidity = forecastHourlyUnits.relativehumidity_2m;
  const unitWindSpeed = forecastHourlyUnits.windspeed_10m;

  const todayWeatherData = getTodayWeatherData(forecastHourly, location.timezone);
  const currentWeatherData = todayWeatherData[0];

  const weatherCode = currentWeatherData.weathercode;
  const temperature = currentWeatherData.temperature_2m + unitTemperature;
  const humidity = <>
    <span>{currentWeatherData.relativehumidity_2m}</span>
    <div className="transition-all text-sm xl:text-base font-semibold text-slate-500">
      {unitHumidity}
    </div>
  </>;
  const windSpeed = <>
    <span>{currentWeatherData.windspeed_10m}</span>
    <div className="transition-all text-sm xl:text-base font-semibold text-slate-500">
      {unitWindSpeed}
    </div>
  </>;

  function renderWeatherDataItem({time, weathercode, temperature_2m}: WeatherData, index: number) {
    return (
      <li data-testid={`hourly-forecast-${index}`} key={time}>
        <div className="rounded-xl bg-sky-200/75 p-2 px-2.5 flex-col items-center text-center font-semibold">
          <div className="text-xs whitespace-nowrap">
            {formatHourlyTime(time, location.timezone)}
          </div>
          <i className={classNames('mdi text-2xl block', weatherCode2MDI(weathercode))}></i>
          <div className="text-xs">{temperature_2m + unitTemperature}</div>
        </div>
      </li>
    );
  }

  return (
    <Card className=''>
      <div data-testid='current-forecast' className="flex flex-wrap md:flex-nowrap items-center justify-between px-2">
        <div className="w-full md:w-auto flex items-center md:justify-between">
          <figure className='w-2/5 md:w-48 -my-6 md:mb-0 md:-mt-16'>
            <Lottie options={{
              loop: true,
              autoplay: true,
              animationData: weatherCode2LottieJSON(weatherCode),
              rendererSettings: {
                preserveAspectRatio: 'xMidYMid slice'
              }
            }}/>
          </figure>
          <div className="space-y-1 p-3 xl:p-5">
            <div className="transition-all text-4xl xl:text-5xl tracking-tight break-all">
              {location.name}
            </div>
            <div className="transition-all text-sm xl:text-base text-slate-500 font-medium capitalize">
              {weatherCode2Str(weatherCode)}
            </div>
          </div>
        </div>
        <div className="space-y-1 p-3 xl:p-5">
          <div className="transition-all text-4xl xl:text-5xl flex items-end tracking-tight">
            {temperature}
          </div>
          <div className="transition-all text-sm xl:text-base text-slate-500 font-medium">
            Temperature
          </div>
        </div>
        <div className="space-y-1 p-3 xl:p-5">
          <div className="transition-all text-4xl xl:text-5xl flex items-end tracking-tight space-x-1">
            {humidity}
          </div>
          <div className="transition-all text-sm xl:text-base text-slate-500 font-medium">
            Humidity
          </div>
        </div>
        <div className="space-y-1 p-3 xl:p-5">
          <div className="transition-all text-4xl xl:text-5xl flex items-end tracking-tight space-x-1">
            {windSpeed}
          </div>
          <div className="transition-all text-sm xl:text-base text-slate-500 font-medium">
            Wind speed
          </div>
        </div>
      </div>
      <ul className="flex space-x-2.5 px-5 pb-5 text-slate-900 overflow-x-auto scrollbar-none">
        {todayWeatherData.map(renderWeatherDataItem)}
      </ul>
    </Card>
  );
}

export default CurrentForecast;
