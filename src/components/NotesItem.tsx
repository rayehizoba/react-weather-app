import React from 'react';
import Card from "./Card";
import {stopPropagation} from "../lib/helpers";
import {NoteResource} from "../lib/types";
import moment from "moment/moment";

interface NotesItemProps {
  note: NoteResource;
  onClickEdit(note: NoteResource): void;
  onClickDelete(note: NoteResource): void;
}

function NotesItem({note, onClickEdit, onClickDelete}: NotesItemProps) {

  function formatNoteDate(date: number) {
    const inputDate = moment(date);
    const todayDate = moment().startOf('day');

    if (inputDate.isSame(todayDate, 'day')) {
      return inputDate.format('HH:mm');
    }
    return inputDate.format('MMM DD');
  }

  return (
    <Card
      onClick={() => onClickEdit(note)}
      data-testid={`notes-item-${note.id}`}
      className="mb-5 group cursor-pointer hover:ring ring-sky-300/25 transition bg-slate-900 p-5 !rounded-2xl space-y-2"
    >
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
          data-testid="delete-note-btn"
          onClick={stopPropagation(() => onClickDelete(note))}
          className='group-hover:opacity-100 opacity-0 transition'
        >
          <i className="mdi mdi-trash-can-outline text-slate-600/50 hover:text-red-500/75 transition"></i>
        </button>
      </div>
    </Card>
  );
}

export default NotesItem;
