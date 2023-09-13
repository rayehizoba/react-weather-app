import {useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {selectForecasts, selectForecastsFetch, selectForecastsFetchError, selectForecastsFetchSuccess} from "../store/forecasts/forecasts.selectors";
import * as forecastsActions from "../store/forecasts/forecasts.actions";
import {ForecastResource, LocationResource, QueryResult} from "../lib/types";

function useForecasts(locations: LocationResource[]): QueryResult<ForecastResource[]> {
  const dispatch = useDispatch();
  const data = useSelector(selectForecasts);
  const loading = useSelector(selectForecastsFetch);
  const success = useSelector(selectForecastsFetchSuccess);
  const error = useSelector(selectForecastsFetchError);

  useEffect(() => {
    if (!loading) {
      dispatch(forecastsActions.fetchForecasts(locations));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, locations]);

  return {data, loading, success, error};
}

export default useForecasts;
