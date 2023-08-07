import {NoteResource} from "../../lib/types";
import {RootState} from "../index";

export const selectNote = (state: RootState): null | NoteResource => state.note.model;
