import React from 'react';
import {renderHook, waitFor} from '@testing-library/react';
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

    const { result } = renderHook(() => useForecast(mockLocation), { wrapper });

    expect(result.current.loading).toBe(true);
    expect(result.current.data).toEqual(null);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
    expect(result.current.data).toEqual(mockResponseData);
    expect(result.current.success).toBe(true);
  });

  it('should handle fetch error', async () => {
    fetchMock.getOnce(url, 500);

    const { result } = renderHook(() => useForecast(mockLocation), { wrapper });

    expect(result.current.data).toEqual(null);
    expect(result.current.loading).toBe(true);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
    expect(result.current.data).toEqual(null);
    expect(result.current.error).toBeTruthy();
  });
});
