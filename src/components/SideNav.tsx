import React, {useEffect} from 'react';
import classNames from "classnames";
import {useDispatch, useSelector} from "react-redux";
import {LocationResource} from "../lib/types";
import * as locationActions from "../store/location/location.actions";
import SideNavItem from "./SideNavItem";
import Card from "./Card";
import {selectLocations} from "../store/locations/locations.selectors";
import {selectLocation} from "../store/location/location.selectors";
import {currentLocationResource} from "../lib/helpers";

interface SideNavProps {
  className?: string,
}

function SideNav({className}: SideNavProps) {
  const dispatch = useDispatch();
  const locations = useSelector(selectLocations);
  const location = useSelector(selectLocation);

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const currentLocation: LocationResource = currentLocationResource(position.coords);
          dispatch(locationActions.setCurrentLocation(currentLocation));
        },
        (error) => {
          console.error("Error getting user location:", error);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  }, []);

  function onClick(location: LocationResource) {
    return () => {
      dispatch(locationActions.setLocation(location));
    }
  }

  function renderEmptyState() {
    return locations.length === 0 && (
      <div className="h-full grid place-content-center">
        <div className="text-slate-400 font-medium text-center">
          Your favorite locations will appear here
        </div>
      </div>
    )
  }

  return (
    <div className={classNames("bg-slate-900 h-full rounded-3xl", className)}>
      <Card className='p-3 overflow-y-auto h-full bg-slate-600/25 lg:bg-slate-600/50'>
        <ul className='px-3'>
          {locations.map((item, index, arr) => (
            <SideNavItem
              key={item.id}
              active={item.id === location?.id}
              peerActive={locations[index + 1]?.id === location?.id}
              last={index === arr.length - 1}
              onClick={onClick(item)}
              location={item}
            />
          ))}
        </ul>
        {renderEmptyState()}
      </Card>
    </div>
  );
}

export default SideNav;
