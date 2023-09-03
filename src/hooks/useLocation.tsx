import {useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {selectIsCurrentLocation, selectLocation} from "../store/location/location.selectors";
import {selectIsFavoriteLocation} from "../store/locations/locations.selectors";
import * as locationActions from "../store/location/location.actions";
import {LocationResource} from "../lib/types";
import {RootState} from "../store";

interface UseLocationHook {
  isCurrentLocation: boolean,
  isFavoriteLocation: boolean;
  location: LocationResource | null;

  setLocation(location: LocationResource | null): void;

  toggleFavoriteLocation(): void;
}

function useLocation(): UseLocationHook {
  const dispatch = useDispatch();

  const location = useSelector(selectLocation);
  const isCurrentLocation = useSelector((state: RootState) =>
    location ? selectIsCurrentLocation(state, location.id) : false
  );
  const isFavoriteLocation = useSelector((state: RootState) =>
    location ? selectIsFavoriteLocation(state, location.id) : false
  );

  useEffect(() => {
    if ('geolocation' in navigator) {
      getCurrentPosition();
    } else {
      console.error('Geolocation is not supported by this browser.');
    }
  }, [dispatch]);

  function getCurrentPosition() {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const currentLocation: LocationResource = {
          country: '',
          country_code: '',
          country_id: '',
          elevation: 0,
          feature_code: '',
          id: 'my-location',
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          name: 'My Location',
          population: 1,
          timezone: (
            new Date().toLocaleString('en-US', {timeZoneName: 'short'}).split(' ').pop()
            ?? 'auto'
          ),
        };
        dispatch(locationActions.setCurrentLocation(currentLocation));
      },
      (error) => {
        console.error('Error getting user geolocation:', error);
      }
    );
  }

  function setLocation(location: LocationResource | null) {
    dispatch(locationActions.setLocation(location));
  }

  async function toggleFavoriteLocation() {
    if (location) {
      await dispatch(
        isFavoriteLocation
          ? locationActions.removeLocation(location.id)
          : locationActions.saveLocation(location)
      );
    }
  }

  return {location, setLocation, isCurrentLocation, isFavoriteLocation, toggleFavoriteLocation};
}

export default useLocation;
