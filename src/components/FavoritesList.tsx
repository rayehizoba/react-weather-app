import React from 'react';
import classNames from "classnames";
import {ForecastResource, LocationResource} from "../lib/types";
import FavoritesItem from "./FavoritesItem";
import {areEqualFloats} from "../lib/helpers";
import Card from "./Card";

interface FavoritesListProps {
  className?: string,
  forecasts: ForecastResource[],
  location?: LocationResource | null,
  locations: LocationResource[],

  onClickLocation?(location: LocationResource): void;
}

function FavoritesList({className, forecasts, locations, location, onClickLocation}: FavoritesListProps) {
  function renderEmptyState() {
    return locations.length === 0 && (
      <div className="h-full grid place-content-center">
        <div
          role="note"
          aria-label="Your favorite locations will appear here"
          className="text-slate-400 font-medium text-center"
        >
          Your favorite locations will appear here
        </div>
      </div>
    )
  }

  function renderFavoritesItem(favoriteLocation: LocationResource, index: number, favoriteLocations: LocationResource[]) {
    const forecast = forecasts?.find((each: ForecastResource) => {
      return favoriteLocation
        && areEqualFloats(each.latitude, favoriteLocation.latitude, 0)
        && areEqualFloats(each.longitude, favoriteLocation.longitude, 0);
    });
    const isActive = favoriteLocation.id === location?.id;
    const nextFavoriteLocation = favoriteLocations[index + 1];
    const isPeerActive = nextFavoriteLocation?.id === location?.id;
    const isLast = index === favoriteLocations.length - 1;
    return forecast
      ? (
        <FavoritesItem
          key={favoriteLocation.id}
          location={favoriteLocation}
          forecast={forecast}
          isActive={isActive}
          isPeerActive={isPeerActive}
          isLast={isLast}
          onClick={onClickLocation}
        />
      )
      : null;
  }

  return (
    <div className={classNames("bg-slate-900 h-full rounded-3xl", className)}>
      <Card className='p-3 overflow-y-auto h-full bg-slate-600/25 lg:bg-slate-600/50'>
        <ul data-testid='favorites-list' className='px-3'>
          {locations.map(renderFavoritesItem)}
        </ul>
        {renderEmptyState()}
      </Card>
    </div>
  );
}

export default FavoritesList;
