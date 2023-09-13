import {NoteResource} from "../../lib/types";

export const types = {
  SET_NOTE: 'NOTE/SET_NOTE',
  CREATE_NOTE: 'NOTE/CREATE_NOTE',
  EDIT_NOTE: 'NOTE/EDIT_NOTE',
  DELETE_NOTE: 'NOTE/DELETE_NOTE',
} as const;

export interface NoteState {
  model: null | NoteResource;
}

const initialState: NoteState = {
  model: null,
};

export type Action = { type: typeof types.SET_NOTE; data: null | NoteResource; }
  | { type: typeof types.CREATE_NOTE; data: NoteResource; }
  | { type: typeof types.EDIT_NOTE; data: NoteResource; }
  | { type: typeof types.DELETE_NOTE; data: string| number; };

export default function reducer(state: NoteState = initialState, action: Action): NoteState {
  switch (action.type) {
    default:
      return state;

    case types.SET_NOTE:
      return {
        ...state,
        model: action.data,
      };
  }
}
