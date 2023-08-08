import React, {useEffect} from 'react';
import {Transition} from "@headlessui/react";
import {useDebounce} from "@reactuses/core";
import {useDispatch, useSelector} from "react-redux";
import SearchInput from "./components/SearchInput";
import * as forecastActions from './store/forecast/forecast.actions';
import {selectIsCurrentLocation, selectLocation} from "./store/location/location.selectors";
import {selectForecast, selectForecastFetch} from "./store/forecast/forecast.selectors";
import * as locationActions from "./store/location/location.actions";
import {selectIsFavoriteLocation} from "./store/locations/locations.selectors";
import DailyForecast from "./components/DailyForecast";
import FavoriteButton from "./components/FavoriteButton";
import PageTemplate from "./components/PageTemplate";
import {LocationResource} from "./lib/types";
import SideNav from "./components/SideNav";
import Notes from "./components/Notes";
import Hero from "./components/Hero";
import {RootState} from "./store";
import './App.css';

function App() {
  const dispatch = useDispatch();
  const forecast = useSelector(selectForecast);
  const forecastFetch = useSelector(selectForecastFetch);
  const location = useSelector(selectLocation);
  const debouncedLocation = useDebounce(location, 150);
  const isFavoriteLocation = useSelector((state: RootState) => {
    if (location) return selectIsFavoriteLocation(state, location.id);
    return false;
  });
  const isCurrentLocation = useSelector((state: RootState) => {
    if (location) return selectIsCurrentLocation(state, location.id);
    return false;
  });

  useEffect(() => {
    if (location) {
      dispatch(forecastActions.fetchForecast(location));
    }
  }, [dispatch, location]);

  function onChangeLocation(location: LocationResource) {
    dispatch(locationActions.setLocation(location));
  }

  function onClickAdd() {
    if (location) {
      dispatch(isFavoriteLocation
        ? locationActions.removeLocation(location.id)
        : locationActions.saveLocation(location)
      );
    }
  }

  return (
    <PageTemplate
      renderHeader={(onToggleSidenav) => (
        <header className="flex items-stretch justify-end space-x-2.5">
          {location && !isCurrentLocation && (
            <FavoriteButton
              onClick={onClickAdd}
              busy={forecastFetch}
              active={isFavoriteLocation}
            />
          )}
          <SearchInput onChange={onChangeLocation} busy={forecastFetch}/>
          <button
            type='button'
            onClick={onToggleSidenav}
            className='lg:hidden'
          >
            <i className="mdi mdi-menu text-3xl text-sky-300/50"></i>
          </button>
        </header>
      )}
      renderSidenav={() => <SideNav className='w-64 shadow-xl lg:shadow-none'/>}
    >
      {debouncedLocation && (
        <Transition
          show={!forecastFetch}
          className='space-y-5'
          enter="transform transition duration-200"
          enterFrom="opacity-0 scale-95"
          enterTo="opacity-100 scale-100"
          leave="transform duration-200 transition ease-in-out"
          leaveFrom="opacity-100 scale-100 "
          leaveTo="opacity-0 scale-95 "
        >
          <Hero forecast={forecast} location={debouncedLocation}/>
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-5 items-start">
            <div className="lg:col-span-2 md:sticky md:top-0 space-y-5">
              <DailyForecast forecast={forecast} location={debouncedLocation}/>
            </div>
            <div className="lg:col-span-3">
              <Notes/>
            </div>
          </div>
        </Transition>
      )}
    </PageTemplate>
  );
}

export default App;
