import React from 'react';
import classNames from "classnames";
import Card from "./Card";
import {LocationResource} from "../lib/types";
import * as locationActions from "../store/location/location.actions";
import {useDispatch} from "react-redux";
import SideNavItem from "./SideNavItem";

interface SideNavProps {
  className?: string,
  location: null | LocationResource;
  locations: LocationResource[];
}

function SideNav({className, locations, location}: SideNavProps) {
  const dispatch = useDispatch();

  function onClick(location: LocationResource) {
    return () => {
      dispatch(locationActions.setLocation(location));
    }
  }

  function renderEmptyState() {
    return (
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
