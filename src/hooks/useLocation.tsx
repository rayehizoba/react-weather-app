import {useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {selectIsCurrentLocation, selectLocation} from "../store/location/location.selectors";
import {selectIsFavoriteLocation} from "../store/locations/locations.selectors";
import * as locationActions from "../store/location/location.actions";
import {LocationResource, QueryResult} from "../lib/types";
import {RootState} from "../store";

interface LocationQueryResult extends QueryResult<LocationResource | null> {
  isCurrent: boolean,
  isFavorite: boolean;
  toggleFavorite: () => void;
}

function useLocation(): LocationQueryResult {
  const dispatch = useDispatch();

  const data = useSelector(selectLocation);
  const isCurrent = useSelector((state: RootState) =>
    data ? selectIsCurrentLocation(state, data.id) : false
  );
  const isFavorite = useSelector((state: RootState) =>
    data ? selectIsFavoriteLocation(state, data.id) : false
  );

  useEffect(() => {
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

    if ('geolocation' in navigator) {
      getCurrentPosition();
    } else {
      console.error('Geolocation is not supported by this browser.');
    }
  }, [dispatch]);

  function setData(location: LocationResource | null) {
    dispatch(locationActions.setLocation(location));
  }

  async function toggleFavorite() {
    if (data) {
      await dispatch(
        isFavorite
          ? locationActions.removeLocation(data.id)
          : locationActions.saveLocation(data)
      );
    }
  }

  return {data, setData, isCurrent, isFavorite, toggleFavorite};
}

export default useLocation;
