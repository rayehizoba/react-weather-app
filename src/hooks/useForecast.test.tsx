import React from 'react';
import { renderHook } from '@testing-library/react-hooks';
import useForecast from './useForecast';
import { Provider } from 'react-redux';
import {AnyAction, Store} from "redux";
import fetchMock from "fetch-mock";
import {RootState, setupStore} from "../store";
import {ForecastResource} from "../lib/types";
import {objectToURLQuery} from "../lib/helpers";

const mockLocation = require('../mocks/location-resource-mock.json');
const mockResponseData = require('../mocks/forecast-resource-mock.json');
const url = 'https://api.open-meteo.com/v1/forecast?' + objectToURLQuery({
  daily: ['weathercode', 'temperature_2m_max', 'temperature_2m_min'],
  hourly: ['temperature_2m', 'weathercode', 'windspeed_10m', 'relativehumidity_2m'],
  latitude: mockLocation.latitude,
  longitude: mockLocation.longitude,
  timezone: mockLocation.timezone,
});

function getWrapper(store: Store<any, AnyAction>): React.FC {
  return ({ children }: { children?: React.ReactNode }) => (
    <Provider store={store}>{children}</Provider>
  );
}

describe('useForecast', () => {
  let mockStore: Store;
  let wrapper: React.FC;

  beforeEach(() => {
    fetchMock.reset();
    mockStore = setupStore({} as RootState);
    wrapper = getWrapper(mockStore);
  });

  it('should fetch forecast note when location is provided', async () => {
    fetchMock.getOnce(url, mockResponseData as ForecastResource);

    const { result, waitForNextUpdate } = renderHook(
      () => useForecast(mockLocation),
      { wrapper }
    );

    expect(result.current.forecast).toEqual(null);
    expect(result.current.isLoadingForecast).toBe(true);

    await waitForNextUpdate();

    expect(result.current.forecast).toEqual(mockResponseData);
    expect(result.current.success).toBe(true);
    expect(result.current.isLoadingForecast).toBe(false);
  });

  it('should handle fetch error', async () => {
    fetchMock.getOnce(url, 500);

    const { result, waitForNextUpdate } = renderHook(
      () => useForecast(mockLocation),
      { wrapper }
    );

    expect(result.current.forecast).toEqual(null);
    expect(result.current.isLoadingForecast).toBe(true);

    await waitForNextUpdate();

    expect(result.current.forecast).toEqual(null);
    expect(result.current.error).toBeTruthy();
    expect(result.current.isLoadingForecast).toBe(false);
  });
});
