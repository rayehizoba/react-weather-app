import React from "react";
import fetchMock from "fetch-mock";
import {Provider} from "react-redux";
import {AnyAction, Store} from "redux";
import {renderHook} from '@testing-library/react-hooks';
import {RootState, setupStore} from "../store";
import useLocation from './useLocation';

function getWrapper(store: Store<any, AnyAction>): React.FC {
  return ({children}: { children?: React.ReactNode }) => (
    <Provider store={store}>{children}</Provider>
  );
}

// Mock the navigator.geolocation object
const mockGeolocation = {
  getCurrentPosition: jest.fn(),
};

(global.navigator as any).geolocation = mockGeolocation;

describe('useLocation', () => {
  let mockStore: Store;
  let wrapper: React.FC;

  beforeEach(() => {
    fetchMock.reset();
    mockStore = setupStore({} as RootState);
    wrapper = getWrapper(mockStore);
  });

  it('should set current location when geolocation is available', () => {
    // Mock getCurrentPosition function
    mockGeolocation.getCurrentPosition.mockImplementation((success) => {
      const mockPosition = {
        coords: {
          latitude: 40.7128,
          longitude: -74.0060,
        },
      };
      success(mockPosition);
    });

    const {result} = renderHook(() => useLocation(), {wrapper});

    // Verify that location is set to the current location
    expect(result.current.location).toEqual({
      country: '',
      country_code: '',
      country_id: '',
      elevation: 0,
      feature_code: '',
      id: 'my-location',
      latitude: 40.7128, // Mocked latitude
      longitude: -74.0060, // Mocked longitude
      name: 'My Location',
      population: 1,
      timezone: expect.any(String),
    });
  });

  it('should handle geolocation error', () => {
    // Mock getCurrentPosition function to simulate an error
    mockGeolocation.getCurrentPosition.mockImplementation((success, error) => {
      error(new Error('Geolocation error'));
    });

    // Mock console.error
    console.error = jest.fn();

    const {result} = renderHook(() => useLocation(), {wrapper});

    // Verify that error handling code is executed
    expect(console.error).toHaveBeenCalledWith(
      'Error getting user geolocation:',
      expect.any(Error)
    );

    // Verify that location is null
    expect(result.current.location).toBeNull();
  });

  it('should toggle favorite location', async () => {
    const mockLocation = require('../mocks/location-resource-mock.json');
    const {result, waitForNextUpdate} = renderHook(() => useLocation(), {wrapper});

    // Check that location is initially null
    expect(result.current.location).toBeNull();

    // Set the location
    result.current.setLocation(mockLocation);

    // Check that location is now set correctly
    expect(result.current.location).toEqual(mockLocation);

    // Check that isFavoriteLocation is initially false
    expect(result.current.isFavoriteLocation).toBe(false);

    // Toggle favorite location
    result.current.toggleFavoriteLocation();

    // Check that isFavoriteLocation is now true
    expect(result.current.isFavoriteLocation).toBe(true);

    // Toggle favorite location again
    result.current.toggleFavoriteLocation();
    await waitForNextUpdate();

    // Check that isFavoriteLocation is now false
    expect(result.current.isFavoriteLocation).toBe(false);
  });
});
