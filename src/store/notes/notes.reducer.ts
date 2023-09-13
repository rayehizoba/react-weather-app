import {NoteResource} from "../../lib/types";
import {types as noteTypes, Action as NoteAction} from "../note/note.reducer";

export const types = {} as const;

export interface NotesState {
  collection: NoteResource[];
}

const initialState: NotesState = {
  collection: [],
};

type Action = NoteAction;

export default function reducer(state: NotesState = initialState, action: Action): NotesState {
  switch (action.type) {
    case noteTypes.CREATE_NOTE:
      return {
        ...state,
        collection: [...state.collection, action.data],
      };

    case noteTypes.EDIT_NOTE:
      return {
        ...state,
        collection: state.collection.map(note => {
          if (note.id === action.data.id) {
            return action.data;
          }
          return note;
        }),
      };

    case noteTypes.DELETE_NOTE:
      return {
        ...state,
        collection: state.collection.filter(note => note.id !== action.data),
      };

    default:
      return state;
  }
}
