import {ForecastResource, GeoNamesResponseData, SearchResponseData} from "../lib/types";
import {rest} from "msw";

export const locationMock = require('../mocks/location-resource-mock.json');
export const locationsMock = require('../mocks/locations-resource-mock.json');
export const largestCitiesMock: GeoNamesResponseData = require('../mocks/largest-cities-mock.json');
export const searchResultsMock: SearchResponseData = require('../mocks/search-results-mock.json');
export const forecastMock: ForecastResource = require('../mocks/forecast-mock.json');

const largestCitiesHandler = rest.get('https://public.opendatasoft.com/api/records/1.0/search/', (req, res, ctx) => {
  return res(
    ctx.json(largestCitiesMock),
  );
});

const forecastHandler = rest.get('https://api.open-meteo.com/v1/forecast', (req, res, ctx) => {
  const latitude = req.url.searchParams.get('latitude');
  const longitude = req.url.searchParams.get('longitude');
  return res(
    ctx.json({
      ...forecastMock,
      latitude, longitude
    }),
  );
});

const searchResultHandler = rest.get('https://geocoding-api.open-meteo.com/v1/search', (req, res, ctx) => {
  return res(
    ctx.json(searchResultsMock),
  );
});

export const handlers = [
  largestCitiesHandler,
  forecastHandler,
  searchResultHandler,
];
