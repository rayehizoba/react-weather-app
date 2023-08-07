import {types} from "./note.reducer";
import {ActionType, NoteData, NoteResource} from "../../lib/types";
import {Dispatch} from "redux";
import {RootState} from "../index";
import {selectNotes} from "../notes/notes.selectors";

/**
 *
 * @returns {Function}
 */
export const setNote = (data: null | NoteResource): any => {
  return (dispatch: Dispatch<ActionType<null | NoteResource>>) => {
    dispatch({type: types.SET_NOTE, data});
  }
};

/**
 *
 * @returns {Function}
 */
export const createNote = (data: NoteData): any => {
  return (dispatch: Dispatch<ActionType<NoteData>>) => {
    dispatch({type: types.CREATE_NOTE, data});
  }
};

/**
 *
 * @returns {Function}
 */
export const editNote = (id: number | string, data: NoteData): any => {
  return (dispatch: Dispatch<ActionType<NoteResource>>, getState: () => RootState) => {
    const notes = selectNotes(getState());
    const note = notes.find(note => note.id === id);
    if (note) {
      dispatch({type: types.EDIT_NOTE, data: {...note, ...data}});
    }
  }
};

/**
 *
 * @returns {Function}
 */
export const deleteNote = (id: string | number): any => {
  return (dispatch: Dispatch<ActionType<string | number>>) => {
    dispatch({type: types.DELETE_NOTE, data: id});
  }
};
