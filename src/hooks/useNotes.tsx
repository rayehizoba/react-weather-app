import {useSelector} from "react-redux";
import {NoteResource} from "../lib/types";
import {selectNotes} from "../store/notes/notes.selectors";

interface UseNotesHook {
  notes: NoteResource[];
}

function useNotes(): UseNotesHook {
  const notes = useSelector(selectNotes);
  return {notes};
}

export default useNotes;
