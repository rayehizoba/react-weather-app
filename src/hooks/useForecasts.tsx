import {useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {selectForecasts} from "../store/forecasts/forecasts.selectors";
import * as forecastsActions from "../store/forecasts/forecasts.actions";
import {ForecastResource, LocationResource, QueryResult} from "../lib/types";

function useForecasts(locations: LocationResource[]): QueryResult<ForecastResource[]> {
  const dispatch = useDispatch();
  const data = useSelector(selectForecasts);

  useEffect(() => {
    dispatch(forecastsActions.fetchForecasts(locations));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {data};
}

export default useForecasts;
