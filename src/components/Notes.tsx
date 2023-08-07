import React, {useState} from 'react';
import Card from "./Card";
import EditNote from "./EditNote";
import {stopPropagation} from "../lib/helpers";
import {useDispatch, useSelector} from "react-redux";
import {selectNote} from "../store/note/note.selectors";
import {selectNotes} from "../store/notes/notes.selectors";
import * as noteActions from '../store/note/note.actions';
import {NoteResource} from "../lib/types";
import Masonry from "react-masonry-css";
import moment from "moment";

function Notes() {
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const note = useSelector(selectNote);
  const notes = useSelector(selectNotes);

  function closeModal() {
    setIsOpen(false)
  }

  function onClickNew() {
    dispatch(noteActions.setNote(null));
    setIsOpen(true);
  }

  function onClickEdit(note: NoteResource) {
    return () => {
      dispatch(noteActions.setNote(note));
      setIsOpen(true);
    }
  }

  function onClickDelete(note: NoteResource) {
    return () => {
      if (window.confirm('Are you sure you want to delete this?')) {
        dispatch(noteActions.deleteNote(note.id));
      }
    }
  }

  function formatNoteDate(date: number) {
    const inputDate = moment(date);
    const todayDate = moment().startOf('day');

    if (inputDate.isSame(todayDate, 'day')) {
      return inputDate.format('HH:mm');
    }
    return inputDate.format('MMM DD');
  }

  return (
    <>
      <EditNote note={note} show={isOpen} onClose={closeModal}/>

      <Card className='p-5 space-y-5 col-span-2'>

        <header className="flex items-center justify-between">
          <div className="text-3xl tracking-tight">
            {notes.length ? notes.length + ' ' : ''}Notes
          </div>
          <button
            type='button'
            onClick={onClickNew}
            className='btn-primary'
          >
            <i className="mdi mdi-plus text-3xl text-slate-400"></i>
            <span className='font-medium text-sm text-slate-400'>New Note</span>
          </button>
        </header>

        {Boolean(notes.length) || (
          <div className="text-center py-8">
            <i className="mdi mdi-note-text-outline text-7xl text-slate-600"></i>
            <div className="font-semibold text-slate-600 text-sm">
              No notes created
            </div>
          </div>
        )}

        <Masonry
          breakpointCols={{
            default: 2,
            1100: 1,
          }}
          className="!-mb-5 -ml-5 flex"
          columnClassName="pl-5">
          {notes.map(note => (
            <Card
              key={note.id}
              onClick={onClickEdit(note)}
              className="mb-5 group cursor-pointer hover:ring ring-sky-300/25 transition bg-slate-900 p-5 !rounded-2xl space-y-2">
              <div className="text-lg font-semibold">
                {note.title}
              </div>
              <p className="text-sm text-slate-400/75">
                {note.note}
              </p>
              <div className="flex items-center justify-between">
                <div className="text-sm font-semibold text-slate-600/50">
                  {formatNoteDate(note.updated_at)}
                </div>
                <button
                  type='button'
                  onClick={stopPropagation(onClickDelete(note))}
                  className='group-hover:opacity-100 opacity-0 transition'
                >
                  <i className="mdi mdi-trash-can-outline text-slate-600/50 hover:text-red-500/75 transition"></i>
                </button>
              </div>
            </Card>
          ))}
        </Masonry>

      </Card>
    </>
  );
}

export default Notes;
