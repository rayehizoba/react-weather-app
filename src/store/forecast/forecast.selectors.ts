import {ForecastResource} from "../../lib/types";
import {RootState} from "../index";

export const selectForecast = (state: RootState): null | ForecastResource => state.forecast.model;
export const selectForecastFetch = (state: RootState): boolean => state.forecast.fetch;
export const selectForecastFetchSuccess = (state: RootState): boolean => state.forecast.fetchSuccess;
export const selectForecastFetchError = (state: RootState): null | Error => state.forecast.fetchError;
