import {NoteResource} from "../../lib/types";
import {RootState} from "../index";

export const selectNotes = (state: RootState): NoteResource[] => {
  return state.notes.collection.sort((a, b) => b.updated_at - a.updated_at);
}
