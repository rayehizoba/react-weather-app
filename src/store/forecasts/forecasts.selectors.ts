import {ForecastResource} from "../../lib/types";
import {RootState} from "../index";

export const selectForecasts = (state: RootState): ForecastResource[] => state.forecasts.collection;

export const selectForecastsFetch = (state: RootState) => state.forecasts.fetch;
export const selectForecastsFetchError = (state: RootState) => state.forecasts.fetchError;
export const selectForecastsFetchSuccess = (state: RootState) => state.forecasts.fetchSuccess;
