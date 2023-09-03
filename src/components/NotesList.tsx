import React from 'react';
import Masonry from "react-masonry-css";
import {NoteResource} from "../lib/types";
import NotesItem from "./NotesItem";
import Card from "./Card";

interface NotesProps {
  notes: NoteResource[];
  onClickNew(): void;
  onClickEdit(note: NoteResource): void;
  onClickDelete(note: NoteResource): void;
}

function NotesList({notes, onClickNew, onClickEdit, onClickDelete}: NotesProps) {
  function renderEmptyState() {
    return Boolean(notes.length) || (
      <div data-testid={'empty-state'} className="text-center py-8">
        <i className="mdi mdi-note-text-outline text-7xl text-slate-600"></i>
        <div className="font-semibold text-slate-600 text-sm">
          No notes created
        </div>
      </div>
    )
  }

  function renderNotesItem(note: NoteResource) {
    return (
      <NotesItem key={note.id} note={note} onClickEdit={onClickEdit} onClickDelete={onClickDelete}/>
    );
  }

  return (
    <Card className='p-5 space-y-5 col-span-2'>
      <header className="flex items-center justify-between">
        <div className="text-3xl tracking-tight">
          {notes.length ? notes.length + ' ' : ''}Notes
        </div>
        <button onClick={onClickNew} type='button' className='btn-primary'>
          <i className="mdi mdi-plus text-3xl text-slate-400"></i>
          <span className='font-medium text-sm text-slate-400'>New Note</span>
        </button>
      </header>

      {renderEmptyState()}

      <Masonry
        data-testid="note-list"
        breakpointCols={{default: 2, 1100: 1,}}
        className="!-mb-5 -ml-5 flex"
        columnClassName="pl-5"
      >
        {notes.map(renderNotesItem)}
      </Masonry>
    </Card>
  );
}

export default NotesList;
