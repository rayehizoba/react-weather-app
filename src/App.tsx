import React, {useEffect} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {Transition} from "@headlessui/react";
import SearchInput from "./components/SearchInput";
import * as forecastActions from './store/forecast/forecast.actions';
import {selectLocation} from "./store/location/location.selectors";
import {selectForecast, selectForecastFetch} from "./store/forecast/forecast.selectors";
import * as locationActions from "./store/location/location.actions";
import {selectLocations} from "./store/locations/locations.selectors";
import DailyForecast from "./components/DailyForecast";
import FavoriteButton from "./components/FavoriteButton";
import {LocationResource} from "./lib/types";
import SideNav from "./components/SideNav";
import Notes from "./components/Notes";
import Hero from "./components/Hero";
import PageTemplate from "./components/PageTemplate";
import './App.css';

function App() {
  const dispatch = useDispatch();
  const forecast = useSelector(selectForecast);
  const forecastFetch = useSelector(selectForecastFetch);
  const locations = useSelector(selectLocations);
  const location = useSelector(selectLocation);
  const isFavoriteLocation = locations.findIndex(item => item.id === location?.id) >= 0;

  useEffect(() => {
    if (location) {
      dispatch(forecastActions.fetchForecast(location));
    }
  }, [dispatch, location]);

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          console.log(`Latitude: ${lat}, longitude: ${lng}`);
        },
        (error) => {
          console.error("Error getting user location:", error);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  }, []);

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
          {location && (
            <FavoriteButton
              onClick={onClickAdd}
              busy={forecastFetch}
              active={isFavoriteLocation}
            />
          )}
          <SearchInput onChange={onChangeLocation}/>
          <button
            type='button'
            onClick={onToggleSidenav}
            className='lg:hidden'
          >
            <i className="mdi mdi-menu text-3xl text-sky-300/50"></i>
          </button>
        </header>
      )}
      renderSidenav={() => <SideNav
        className='w-64 shadow-xl lg:shadow-none'
        locations={locations}
        location={location}
      />}
    >
      {location && (
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
          <Hero forecast={forecast} location={location}/>
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-5 items-start">
            <div className="lg:col-span-2 md:sticky md:top-0 space-y-5">
              <DailyForecast forecast={forecast} location={location}/>
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
