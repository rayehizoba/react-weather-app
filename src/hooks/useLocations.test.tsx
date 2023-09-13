import React from "react";
import fetchMock from "fetch-mock";
import { Provider } from "react-redux";
import { Store, AnyAction } from "redux";
import {renderHook, waitFor} from "@testing-library/react";
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

  it('should fetch 15 largest cities sorted in alphabetic order', async () => {
    fetchMock.getOnce(url, mockResponseData as GeoNamesResponseData);

    const { result } = renderHook(() => useLocations(), { wrapper });

    expect(result.current.loading).toBe(true);
    expect(result.current.data).toEqual([]);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
    const compareFn = (a: LocationResource, b: LocationResource) => a.name.localeCompare(b.name);
    const sortedLocations = mockResponseData.records.map(geoNames2Location).sort(compareFn);
    expect(result.current.data).toEqual(sortedLocations);
    expect(result.current.success).toEqual(true);
  });

  it('should handle fetch error', async () => {
    fetchMock.getOnce(url, 500);

    const { result } = renderHook(() => useLocations(), { wrapper });

    expect(result.current.loading).toBe(true);
    expect(result.current.data).toEqual([]);

    await waitFor(() => {
      expect(result.current.data).toEqual([]);
    });
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeTruthy();
  });
});

