import React from "react";
import fetchMock from "fetch-mock";
import {Provider} from "react-redux";
import {AnyAction, Store} from "redux";
import {renderHook} from "@testing-library/react-hooks/dom";
import {RootState, setupStore} from "../store";
import useNotes from "./useNotes";

function getWrapper(store: Store<any, AnyAction>): React.FC {
  return ({children}: { children?: React.ReactNode }) => (
    <Provider store={store}>{children}</Provider>
  );
}

describe('useNotes', () => {
  let mockStore: Store;
  let wrapper: React.FC;

  beforeEach(() => {
    fetchMock.reset();
    mockStore = setupStore({} as RootState);
    wrapper = getWrapper(mockStore);
  });

  it("should initialize with default values", () => {
    const {result} = renderHook(() => useNotes(), {wrapper});

    expect(result.current.notes).toEqual([]);
  });
});
