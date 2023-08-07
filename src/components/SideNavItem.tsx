import React, {useEffect} from 'react';
import classNames from "classnames";
import {LocationResource} from "../lib/types";
import {useSelector} from "react-redux";
import {selectForecasts} from "../store/forecasts/forecasts.selectors";
import {areEqualFloats, weatherCode2Str} from "../lib/helpers";
import moment from "moment-timezone";

interface SideNavItemProps {
  active: boolean;
  last: boolean;
  peerActive: boolean;

  onClick(): void;

  location: null | LocationResource;
}

const ACTIVE_CLASS_NAME = 'js-active-sidenav-item';

function SideNavItem({active, peerActive, last, onClick, location}: SideNavItemProps) {

  const forecasts = useSelector(selectForecasts);
  const forecast = forecasts.find(item => {
    return location
      && areEqualFloats(item.latitude, location.latitude, 0)
      && areEqualFloats(item.longitude, location?.longitude, 0);
  });

  const now = moment().tz(location?.timezone ?? '').startOf('hour');
  const startIndex = forecast?.hourly.time.findIndex((time) => {
    const currentTime = moment(time).tz(location?.timezone ?? '');
    return currentTime.isSameOrAfter(now);
  });

  if (startIndex && startIndex >= 0) {
    console.log(
      location,
      forecast?.daily.temperature_2m_max[0],
      forecast?.daily.temperature_2m_min[0],
      startIndex,
      moment(forecast?.hourly.time[startIndex]).tz(location?.timezone ?? '').format("h a")
    );
  }

  useEffect(() => {
    const targetElement = document.getElementById(ACTIVE_CLASS_NAME);
    if (targetElement) {
      targetElement.scrollIntoView({block: 'center'});
    }
  }, []);

  return (
    <li
      onClick={onClick}
      className={classNames(
        'cursor-pointer relative before:transition before:absolute before:-inset-0 before:-mx-3 before:-my-px before:rounded-2xl',
        !last && 'border-b border-slate-600',
        active ? 'before:bg-sky-200/25 border-transparent' : 'hover:opacity-75',
        peerActive && 'border-transparent',
      )}
      id={active ? ACTIVE_CLASS_NAME : ''}
    >
      <div className="space-y-2 py-2">
        <div className="flex justify-between">
          <div>
            <div className="font-bold text-sm">
              {location?.name}
            </div>
            <div className="text-xs font-bold text-slate-500 uppercase">
              {(startIndex && startIndex >= 0)
                ? moment(forecast?.hourly.time[startIndex]).tz(location?.timezone ?? '').format("h a")
                : '-'}
            </div>
          </div>
          <div className="text-3xl text-slate-500">
            {(startIndex && startIndex >= 0) ? (
              <span>{forecast?.hourly.temperature_2m[startIndex]}°</span>
            ) : '--'}
          </div>
        </div>
        <div className="flex justify-between">
          <div className="font-bold text-xs text-slate-500">
            {(startIndex && startIndex >= 0)
              ? weatherCode2Str(forecast?.hourly.weathercode[startIndex])
              : '-'
            }
          </div>
          <div className="font-bold text-xs text-slate-500">
            {forecast?.daily.temperature_2m_max[0]}°
            <span className="text-slate-600">/ {forecast?.daily.temperature_2m_min[0]}°</span>
          </div>
        </div>
      </div>
    </li>
  );
}

export default SideNavItem;
