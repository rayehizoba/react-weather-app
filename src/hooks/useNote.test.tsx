import React from "react";
import fetchMock from "fetch-mock";
import {Provider} from "react-redux";
import {AnyAction, Store} from "redux";
import {renderHook} from "@testing-library/react-hooks/dom";
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

    expect(result.current.note).toBeNull();
    expect(result.current.isEditingNote).toEqual(false);
  });

  it("should handleNewNote correctly", () => {
    const {result: notesResult} = renderHook(() => useNotes(), {wrapper});
    const {result: noteResult} = renderHook(() => useNote(), {wrapper});

    noteResult.current.handleNewNote();

    expect(noteResult.current.note).toEqual(null);
    expect(noteResult.current.isEditingNote).toEqual(true);
    expect(notesResult.current.notes.length).toEqual(0);

    const newNote: NoteData = {
      title: 'Test Note',
      note: 'This is a test note',
    };
    noteResult.current.handleSubmitNote(newNote);

    expect(notesResult.current.notes.length).toEqual(1);
  });

  it("should handleEditNote correctly", () => {
    const {result: notesResult} = renderHook(() => useNotes(), {wrapper});
    const {result: noteResult} = renderHook(() => useNote(), {wrapper});

    expect(noteResult.current.note).toEqual(null);
    expect(noteResult.current.isEditingNote).toEqual(false);
    expect(notesResult.current.notes.length).toEqual(0);

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

    noteResult.current.handleSubmitNote(noteA);
    noteResult.current.handleSubmitNote(noteB);
    expect(notesResult.current.notes).toEqual([noteA, noteB]);

    noteResult.current.handleEditNote(noteB);
    expect(noteResult.current.note).toEqual(noteB);
    expect(noteResult.current.isEditingNote).toEqual(true);

    const updatedNoteB = {
      ...noteB,
      title: 'Updated Note',
      note: 'Updated note',
    };

    noteResult.current.handleSubmitNote(updatedNoteB);
    expect(notesResult.current.notes).toEqual([noteA, updatedNoteB]);
  });

  it("should handleDeleteNote correctly", () => {
    const windowConfirmMock = jest.spyOn(window, "confirm").mockReturnValue(true);

    const {result: notesResult} = renderHook(() => useNotes(), {wrapper});
    const {result: noteResult} = renderHook(() => useNote(), {wrapper});

    expect(notesResult.current.notes.length).toEqual(0);

    const newNote: NoteData = {
      title: 'Test Note',
      note: 'This is a test note',
    };
    noteResult.current.handleSubmitNote(newNote);

    expect(notesResult.current.notes.length).toEqual(1);

    noteResult.current.handleDeleteNote(notesResult.current.notes[0]);

    expect(windowConfirmMock).toHaveBeenCalledWith("Are you sure you want to delete this?");
    expect(notesResult.current.notes.length).toEqual(0)

    windowConfirmMock.mockRestore();
  });
});
