import React from 'react';
import Card from "./Card";
import classNames from "classnames";
import {weatherCode2MDI} from "../lib/helpers";
import moment from "moment-timezone";
import {ForecastResource, LocationResource} from "../lib/types";

interface DailyForecastProps {
  forecast: null | ForecastResource;
  location: null | LocationResource;
}

function DailyForecast({forecast, location}: DailyForecastProps) {
  const currentDate = moment().startOf('day');
  return (
    <>
      <Card className='p-5 space-y-5'>
        <div className="text-3xl tracking-tight">
          {forecast?.daily.time.length}-Day Forecast
        </div>
        <ul className='space-y-2'>
          {forecast?.daily.time.map((time, index) => (
            <li key={index}>
              <Card className="bg-slate-900 p-3 !rounded-2xl">
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-5">
                    <i className={classNames(
                      'mdi text-4xl',
                      weatherCode2MDI(forecast?.daily.weathercode[index])
                    )}></i>
                    <div className="flex items-end space-x-1">
                      <div className="text-3xl leading-none">
                        {moment(time).format('D')}
                      </div>
                      <div className="text-xs font-semibold opacity-50">
                        {moment(time).isSame(currentDate, 'day')
                          ? 'Today'
                          : moment(time).format('ddd')
                        }
                      </div>
                    </div>
                  </div>
                  <div className="flex items-end">
                    <div className="text-3xl leading-none">
                      {forecast?.daily.temperature_2m_min[index]}°
                    </div>
                    <div className="text-xs font-semibold opacity-50">
                      /{forecast?.daily.temperature_2m_max[index]}°
                    </div>
                  </div>
                </div>
              </Card>
            </li>
          ))}
        </ul>
      </Card>

      {/* Footer Section */}
      {location && (
        <footer className="text-center text-slate-400 text-xs font-semibold">
          Weather
          for {location.name}{Boolean(location.admin1) && ', ' + location.admin1}{Boolean(location.country) && ', ' + location.country}
        </footer>
      )}
    </>
  );
}

export default DailyForecast;
