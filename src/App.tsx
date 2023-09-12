import React, {useEffect} from 'react';
import classNames from "classnames";
import toast, {Toaster} from 'react-hot-toast';
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
import useForecast from "./hooks/useForecast";
import useLocations from "./hooks/useLocations";
import useForecasts from "./hooks/useForecasts";
import useLocation from "./hooks/useLocation";
import NoteEditor from "./components/NoteEditor";
import useNotes from "./hooks/useNotes";
import useNote from "./hooks/useNote";
import './App.css';

function App() {
  const {data: notes} = useNotes();
  const {
    data: note,
    editing: editingNote,
    onCreate: onCreateNote,
    onDelete: onDeleteNote,
    onEdit: onEditNote,
    onSubmit: onSubmitNote,
    setEditing: setEditingNote,
  } = useNote();

  const {data: locations, loading: locationsLoading, error: locationsError} = useLocations();
  const {data: location, setData: setLocation, current, favorite, toggleFavorite} = useLocation();
  const debouncedLocation = useDebounce(location, 150);

  const {data: forecasts} = useForecasts(locations);
  const {data: forecast, loading: forecastLoading, error: forecastError} = useForecast(location);

  const isLoading = forecastLoading || locationsLoading;
  const debouncedIsLoading = useDebounce(isLoading, 150);
  const error = forecastError ?? locationsError;

  useEffect(() => {
    if (error && error.message) {
      toast.error(error.message, {
        id: 'error',
        className: 'bg-slate-600/75 text-white rounded-xl border border-slate-600 shadow-xl backdrop-blur-sm font-medium',
      });
    }
  }, [error]);

  function onChangeLocation(location: LocationResource) {
    setLocation && setLocation(location);
  }

  function renderHeader({onToggleSidenav, showSidenav}: PageTemplateHeaderProps) {
    return (
      <header className="flex items-stretch justify-end space-x-2.5 relative">
        {location && !current && (
          <FavoriteButton onClick={toggleFavorite} busy={forecastLoading} active={favorite}/>
        )}
        <SearchInput onChange={onChangeLocation} busy={debouncedIsLoading}/>
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
        onClickLocation={(location: LocationResource) => setLocation && setLocation(location)}
        className='w-64 shadow-xl lg:shadow-none'
      />
    );
  }

  return (
    <PageTemplate renderHeader={renderHeader} renderSidenav={renderSidenav}>
      {debouncedLocation && forecast && (
        <Transition
          show={!forecastLoading}
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
                show={editingNote}
                onSubmit={onSubmitNote}
                onClose={() => setEditingNote(false)}
              />
              <NotesList
                notes={notes}
                onClickNew={onCreateNote}
                onClickEdit={onEditNote}
                onClickDelete={onDeleteNote}
              />
            </div>
          </div>
        </Transition>
      )}
      <Toaster position={'bottom-center'} containerStyle={{bottom: 35}}/>
    </PageTemplate>
  );
}

export default App;
