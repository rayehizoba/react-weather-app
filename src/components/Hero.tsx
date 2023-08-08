import React from 'react';
import Lottie from "react-lottie";
import moment from "moment-timezone";
import classNames from "classnames";
import {useDebounce} from "@reactuses/core";
import {ForecastResource, LocationResource} from "../lib/types";
import {weatherCode2LottieJSON, weatherCode2MDI, weatherCode2Str} from "../lib/helpers";
import Card from "./Card";

interface HeroProps {
  forecast: null | ForecastResource;
  location: null | LocationResource;
}

function Hero({forecast, location}: HeroProps) {
  const debouncedLocation = useDebounce(location, 150);

  const now = (debouncedLocation ? moment().tz(debouncedLocation?.timezone) : moment()).startOf('hour');
  const next24Hours = moment(now).add(24, 'hours');
  const startIndex = forecast?.hourly.time.findIndex((time) => {
    const currentTime = moment(time).tz(debouncedLocation?.timezone ?? '');
    return currentTime.isSameOrAfter(now) && currentTime.isSameOrBefore(next24Hours);
  }) ?? 0;
  const endIndex = forecast?.hourly.time.findIndex((time) => {
    const currentTime = moment(time).tz(debouncedLocation?.timezone ?? '');
    return currentTime.isAfter(next24Hours);
  }) ?? startIndex;
  const indicesList = [];

  if (startIndex >= 0 && endIndex > 0) {
    for (let i = startIndex; i < endIndex; i++) {
      indicesList.push(i);
    }
  }

  return (
    <Card className=''>
      <div className="flex flex-wrap md:flex-nowrap items-center justify-between px-2">
        <div className="w-full md:w-auto flex items-center md:justify-between">
          <figure className='w-2/5 md:w-48 -my-6 md:mb-0 md:-mt-16'>
            {startIndex >= 0 && (
              <Lottie options={{
                loop: true,
                autoplay: true,
                animationData: weatherCode2LottieJSON(forecast?.hourly.weathercode[startIndex]),
                rendererSettings: {
                  preserveAspectRatio: 'xMidYMid slice'
                }
              }}/>
            )}
          </figure>
          <div className="space-y-1 p-3 xl:p-5">
            <div className="transition-all text-4xl xl:text-5xl tracking-tight break-all">
              {debouncedLocation?.name}
            </div>
            <div className="transition-all text-sm xl:text-base text-slate-500 font-medium capitalize">
              {startIndex >= 0 && (
                weatherCode2Str(forecast?.hourly.weathercode[startIndex])
              )}
            </div>
          </div>
        </div>
        <div className="space-y-1 p-3 xl:p-5">
          <div className="transition-all text-4xl xl:text-5xl flex items-end tracking-tight">
            {startIndex >= 0 && (
              <span>{forecast?.hourly.temperature_2m[startIndex]}°</span>
            )}
          </div>
          <div className="transition-all text-sm xl:text-base text-slate-500 font-medium">
            Temperature
          </div>
        </div>
        <div className="space-y-1 p-3 xl:p-5">
          <div className="transition-all text-4xl xl:text-5xl flex items-end tracking-tight space-x-1">
            {startIndex >= 0 && (
              <span>{forecast?.hourly.relativehumidity_2m[startIndex]}</span>
            )}
            <div className="transition-all text-sm xl:text-base font-semibold text-slate-500">
              {forecast?.hourly_units.relativehumidity_2m}
            </div>
          </div>
          <div className="transition-all text-sm xl:text-base text-slate-500 font-medium">
            Humidity
          </div>
        </div>
        <div className="space-y-1 p-3 xl:p-5">
          <div className="transition-all text-4xl xl:text-5xl flex items-end tracking-tight space-x-1">
            {startIndex >= 0 && (
              <span>{forecast?.hourly.windspeed_10m[startIndex]}</span>
            )}
            <div className="transition-all text-sm xl:text-base font-semibold text-slate-500">
              {forecast?.hourly_units.windspeed_10m}
            </div>
          </div>
          <div className="transition-all text-sm xl:text-base text-slate-500 font-medium">
            Wind speed
          </div>
        </div>
      </div>
      <ul className="flex space-x-2.5 px-5 pb-5 text-slate-900 overflow-x-auto scrollbar-none">
        {indicesList.map((index: number) => (
          <li key={forecast?.hourly.time[index]}>
            <div className="rounded-2xl bg-sky-200/75 p-2 px-3 flex-col items-center text-center font-semibold">
              <div className="text-xs whitespace-nowrap">
                {index === startIndex
                  ? 'Now'
                  : moment(forecast?.hourly.time[index]).tz(debouncedLocation?.timezone ?? '').format("h a")
                }
              </div>
              <i className={classNames(
                'mdi text-2xl block',
                weatherCode2MDI(forecast?.hourly.weathercode[index])
              )}></i>
              <div className="text-sm">
                {forecast?.hourly.temperature_2m[index]}°
              </div>
            </div>
          </li>
        ))}
      </ul>
    </Card>
  );
}

export default Hero;
