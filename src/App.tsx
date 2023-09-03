import React from 'react';
import classNames from "classnames";
import {Transition} from "@headlessui/react";
import {useDebounce} from "@reactuses/core";
import SearchInput from "./components/SearchInput";
import DailyForecast from "./components/DailyForecast";
import FavoriteButton from "./components/FavoriteButton";
import PageTemplate, {PageTemplateHeaderProps} from "./components/PageTemplate";
import {LocationResource} from "./lib/types";
import FavoritesList from "./components/FavoritesList";
import NotesList from "./components/NotesList";
import CurrentForecast from "./components/CurrentForecast";
// import ApiError from "./components/ApiError";
import useForecast from "./hooks/useForecast";
import useLocations from "./hooks/useLocations";
import useForecasts from "./hooks/useForecasts";
import useLocation from "./hooks/useLocation";
import NoteEditor from "./components/NoteEditor";
import useNotes from "./hooks/useNotes";
import useNote from "./hooks/useNote";
import './App.css';

function App() {
  const {notes} = useNotes();
  const {
    note, isEditingNote, handleNewNote, handleEditNote,
    handleDeleteNote, setIsEditingNote, handleSubmitNote
  } = useNote();

  const {locations, isLoadingLocations} = useLocations();
  const {location, setLocation, isCurrentLocation, isFavoriteLocation, toggleFavoriteLocation} = useLocation();
  const debouncedLocation = useDebounce(location, 150);

  const {forecasts} = useForecasts(locations);
  const {forecast, isLoadingForecast,} = useForecast(location);

  const isLoading = isLoadingForecast || isLoadingLocations;
  // const error = forecastFetchError ?? locationsFetchError;

  function onChangeLocation(location: LocationResource) {
    setLocation && setLocation(location);
  }

  function renderHeader({onToggleSidenav, showSidenav}: PageTemplateHeaderProps) {
    return (
      <header className="flex items-stretch justify-end space-x-2.5 relative">
        {/*{error && <ApiError error={error}/>}*/}
        {location && !isCurrentLocation && (
          <FavoriteButton
            onClick={toggleFavoriteLocation}
            active={isFavoriteLocation}
            busy={isLoadingForecast}
          />
        )}
        <SearchInput onChange={onChangeLocation} busy={isLoading}/>
        <button type='button' onClick={onToggleSidenav} className='lg:hidden z-10'>
          <i className={classNames("mdi text-3xl text-sky-300/50", showSidenav ? 'mdi-close' : 'mdi-menu')}></i>
        </button>
      </header>
    );
  }

  function renderSidenav() {
    return (
      <FavoritesList
        location={location}
        locations={locations}
        forecasts={forecasts}
        isLoading={isLoadingLocations}
        onClickLocation={(location: LocationResource) => setLocation && setLocation(location)}
        className='w-64 shadow-xl lg:shadow-none'
      />
    );
  }

  return (
    <PageTemplate renderHeader={renderHeader} renderSidenav={renderSidenav}>
      {debouncedLocation && forecast && (
        <Transition
          show={!isLoadingForecast}
          enter="transform transition duration-200"
          enterFrom="opacity-0 scale-95"
          enterTo="opacity-100 scale-100"
          leave="transform duration-200 transition ease-in-out"
          leaveFrom="opacity-100 scale-100"
          leaveTo="opacity-0 scale-95"
          className='space-y-5'
        >
          <CurrentForecast forecast={forecast} location={debouncedLocation}/>
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-5 items-start">
            <div className="lg:col-span-2 md:sticky md:top-0 space-y-5">
              <DailyForecast forecast={forecast} location={debouncedLocation}/>
            </div>
            <div className="lg:col-span-3">
              <NoteEditor
                note={note}
                show={isEditingNote}
                onSubmit={handleSubmitNote}
                onClose={() => setIsEditingNote(false)}
              />
              <NotesList
                notes={notes}
                onClickNew={handleNewNote}
                onClickEdit={handleEditNote}
                onClickDelete={handleDeleteNote}
              />
            </div>
          </div>
        </Transition>
      )}
    </PageTemplate>
  );
}

export default App;
