import {useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {selectNote} from "../store/note/note.selectors";
import * as noteActions from "../store/note/note.actions";
import {NoteData, NoteResource} from "../lib/types";

interface UseNotesHook {
  handleDeleteNote(note: NoteResource): void;

  handleEditNote(note: NoteResource): void;

  handleNewNote(): void;

  handleSubmitNote(data: NoteData): void;

  isEditingNote: boolean;

  note: NoteResource | null;

  setIsEditingNote(isEditingNote: boolean): void;
}

function useNote(): UseNotesHook {
  const dispatch = useDispatch();
  const note = useSelector(selectNote);

  const [isEditingNote, setIsEditingNote] = useState(false);

  function handleNewNote() {
    dispatch(noteActions.setNote(null));
    setIsEditingNote(true);
  }

  function handleEditNote(note: NoteResource) {
    dispatch(noteActions.setNote(note));
    setIsEditingNote(true);
  }

  function handleDeleteNote(note: NoteResource) {
    if (window.confirm('Are you sure you want to delete this?')) {
      dispatch(noteActions.deleteNote(note.id));
    }
  }

  function handleSubmitNote(data: NoteData) {
    if (note) {
      dispatch(noteActions.editNote(note.id, data));
    } else {
      dispatch(noteActions.createNote(data));
    }
  }

  return {handleDeleteNote, handleEditNote, handleNewNote, handleSubmitNote, isEditingNote, note, setIsEditingNote};
}

export default useNote;
