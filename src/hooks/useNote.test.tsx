import React from "react";
import fetchMock from "fetch-mock";
import {Provider} from "react-redux";
import {AnyAction, Store} from "redux";
import {renderHook, waitFor} from "@testing-library/react";
import {RootState, setupStore} from "../store";
import {NoteData} from "../lib/types";
import useNote from "./useNote";
import useNotes from "./useNotes";

function getWrapper(store: Store<any, AnyAction>): React.FC {
  return ({children}: { children?: React.ReactNode }) => (
    <Provider store={store}>{children}</Provider>
  );
}

describe('useNote and userNotes', () => {
  let mockStore: Store;
  let wrapper: React.FC;

  beforeEach(() => {
    fetchMock.reset();
    mockStore = setupStore({} as RootState);
    wrapper = getWrapper(mockStore);
  });

  it("should initialize with default values", () => {
    const {result} = renderHook(() => useNote(), {wrapper});

    expect(result.current.data).toBeNull();
    expect(result.current.editing).toEqual(false);
  });

  it("should handleNewNote correctly", async () => {
    const {result: notesResult} = renderHook(() => useNotes(), {wrapper});
    const {result: noteResult} = renderHook(() => useNote(), {wrapper});

    await waitFor(() => {
      noteResult.current.onCreate();
      expect(noteResult.current.editing).toEqual(true);
    });

    expect(noteResult.current.data).toEqual(null);
    expect(notesResult.current.data.length).toEqual(0);

    const newNote: NoteData = {
      title: 'Test Note',
      note: 'This is a test note',
    };

    await waitFor(() => {
      noteResult.current.onSubmit(newNote);
      expect(notesResult.current.data.length).toEqual(1);
    });
  });

  it("should handleEditNote correctly", async () => {
    const {result: notesResult} = renderHook(() => useNotes(), {wrapper});
    const {result: noteResult} = renderHook(() => useNote(), {wrapper});

    expect(noteResult.current.data).toEqual(null);
    expect(noteResult.current.editing).toEqual(false);
    expect(notesResult.current.data.length).toEqual(0);

    const noteA = {
      id: '1',
      title: 'Test Note 1',
      note: 'This is a test note 1',
      created_at: Date.now(),
      updated_at: Date.now(),
    };
    const noteB = {
      id: '2',
      title: 'Test Note 2',
      note: 'This is a test note 2',
      created_at: Date.now(),
      updated_at: Date.now(),
    };

    await waitFor(() => {
      noteResult.current.onSubmit(noteA);
      noteResult.current.onSubmit(noteB);
    });

    expect(notesResult.current.data).toEqual([noteA, noteB]);

    await waitFor(() => {
      noteResult.current.onEdit(noteB);

      expect(noteResult.current.data).toEqual(noteB);
    });
    expect(noteResult.current.editing).toEqual(true);

    const updatedNoteB = {
      ...noteB,
      title: 'Updated Note',
      note: 'Updated note',
    };

    await waitFor(() => {
      noteResult.current.onSubmit(updatedNoteB);
      expect(notesResult.current.data).toEqual([noteA, updatedNoteB]);
    });
  });

  it("should handleDeleteNote correctly", async () => {
    const windowConfirmMock = jest.spyOn(window, "confirm").mockReturnValue(true);

    const {result: notesResult} = renderHook(() => useNotes(), {wrapper});
    const {result: noteResult} = renderHook(() => useNote(), {wrapper});

    expect(notesResult.current.data.length).toEqual(0);

    const newNote: NoteData = {
      title: 'Test Note',
      note: 'This is a test note',
    };

    await waitFor(() => {
      noteResult.current.onSubmit(newNote);
    });

    expect(notesResult.current.data.length).toEqual(1);

    await waitFor(() => {
      noteResult.current.onDelete(notesResult.current.data[0]);
    });

    expect(notesResult.current.data.length).toEqual(0)
    expect(windowConfirmMock).toHaveBeenCalledWith("Are you sure you want to delete this?");

    windowConfirmMock.mockRestore();
  });
});
