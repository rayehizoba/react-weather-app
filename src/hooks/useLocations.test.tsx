import React from "react";
import fetchMock from "fetch-mock";
import { Provider } from "react-redux";
import { Store, AnyAction } from "redux";
import { renderHook } from "@testing-library/react-hooks/dom";
import { GeoNamesResponseData, LocationResource } from "../lib/types";
import { geoNames2Location, objectToURLQuery } from "../lib/helpers";
import { RootState, setupStore } from "../store";
import useLocations from "./useLocations";

const url = 'https://public.opendatasoft.com/api/records/1.0/search/?' + objectToURLQuery({
  dataset: 'geonames-all-cities-with-a-population-1000',
  rows: 15,
  sort: 'population',
});
const mockResponseData = require("../mocks/largest-cities-mock.json");

function getWrapper(store: Store<any, AnyAction>): React.FC {
  return ({ children }: { children?: React.ReactNode }) => (
    <Provider store={store}>{children}</Provider>
  );
}

describe('useLocations', () => {
  let mockStore: Store;
  let wrapper: React.FC;

  beforeEach(() => {
    fetchMock.reset();
    mockStore = setupStore({} as RootState);
    wrapper = getWrapper(mockStore);
  });

  it('should fetch 15 largest cities location note', async () => {
    fetchMock.getOnce(url, mockResponseData as GeoNamesResponseData);

    const { result, waitForNextUpdate } = renderHook(() => useLocations(), { wrapper });

    expect(result.current.locations).toEqual([]);
    expect(result.current.isLoadingLocations).toBe(true);

    await waitForNextUpdate();

    const sortedLocations = mockResponseData.records
      .map(geoNames2Location)
      .sort((a: LocationResource, b: LocationResource) => a.name.localeCompare(b.name));
    expect(result.current.locations).toEqual(sortedLocations);
    expect(result.current.success).toEqual(true);
    expect(result.current.isLoadingLocations).toBe(false);
  });

  it('should handle fetch error', async () => {
    fetchMock.getOnce(url, 500);

    const { result, waitForNextUpdate } = renderHook(() => useLocations(), { wrapper });

    expect(result.current.locations).toEqual([]);
    expect(result.current.isLoadingLocations).toBe(true);

    await waitForNextUpdate();

    expect(result.current.locations).toEqual([]);
    expect(result.current.error).toBeTruthy();
    expect(result.current.isLoadingLocations).toBe(false);
  });
});

