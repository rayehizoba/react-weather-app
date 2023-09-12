import {useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {selectNote} from "../store/note/note.selectors";
import * as noteActions from "../store/note/note.actions";
import {NoteData, NoteResource, QueryResult} from "../lib/types";

interface NoteQueryResult extends QueryResult<NoteResource | null> {
  editing: boolean;
  onCreate: () => void;
  onDelete: (note: NoteResource) => void;
  onEdit: (note: NoteResource) => void;
  onSubmit: (note: NoteData) => void;
  setEditing: (editing: boolean) => void;
}

function useNote(): NoteQueryResult {
  const dispatch = useDispatch();
  const data = useSelector(selectNote);

  const [editing, setEditing] = useState(false);

  function onCreate() {
    dispatch(noteActions.setNote(null));
    setEditing(true);
  }

  function onEdit(note: NoteResource) {
    dispatch(noteActions.setNote(note));
    setEditing(true);
  }

  function onDelete(note: NoteResource) {
    if (window.confirm('Are you sure you want to delete this?')) {
      dispatch(noteActions.deleteNote(note.id));
    }
  }

  function onSubmit(note: NoteData) {
    if (data) {
      dispatch(noteActions.editNote(data.id, note));
    } else {
      dispatch(noteActions.createNote(note));
    }
  }

  return {data, editing, onCreate, onDelete, onEdit, onSubmit, setEditing};
}

export default useNote;
