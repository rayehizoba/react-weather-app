import {useSelector} from "react-redux";
import {NoteResource, QueryResult} from "../lib/types";
import {selectNotes} from "../store/notes/notes.selectors";

function useNotes(): QueryResult<NoteResource[]> {
  const data = useSelector(selectNotes);
  return {data};
}

export default useNotes;
