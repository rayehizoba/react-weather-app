import {ForecastResource} from "../../lib/types";
import {RootState} from "../index";

export const selectForecasts = (state: RootState): ForecastResource[] => state.forecasts.collection;
