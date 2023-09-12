import {useLayoutEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {selectForecasts} from "../store/forecasts/forecasts.selectors";
import * as forecastsActions from "../store/forecasts/forecasts.actions";
import {ForecastResource, LocationResource, QueryResult} from "../lib/types";

function useForecasts(locations: LocationResource[]): QueryResult<ForecastResource[]> {
  const dispatch = useDispatch();
  const data = useSelector(selectForecasts);

  useLayoutEffect(() => {
    dispatch(forecastsActions.fetchForecasts(locations));
  }, []);

  return {data};
}

export default useForecasts;
