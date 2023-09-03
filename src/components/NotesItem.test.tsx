import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import NotesItem from './NotesItem';
import {NoteResource} from "../lib/types";

describe('NotesItem', () => {
  const mockNote: NoteResource = {
    id: '1',
    title: 'Test Note',
    note: 'This is a test note',
    created_at: Date.now(),
    updated_at: Date.now(),
  };

  it('renders the note title and content', () => {
    render(<NotesItem note={mockNote} onClickEdit={() => {}} onClickDelete={() => {}} />);

    expect(screen.getByText('Test Note')).toBeInTheDocument();
    expect(screen.getByText('This is a test note')).toBeInTheDocument();
  });

  it('calls onClickEdit when clicked', () => {
    const onClickEdit = jest.fn();
    render(<NotesItem note={mockNote} onClickEdit={onClickEdit} onClickDelete={() => {}} />);

    const noteItem = screen.getByTestId(`notes-item-${mockNote.id}`);
    fireEvent.click(noteItem);

    expect(onClickEdit).toHaveBeenCalledWith(mockNote);
  });

  it('calls onClickDelete when delete button is clicked', () => {
    const onClickDelete = jest.fn();
    render(<NotesItem note={mockNote} onClickEdit={() => {}} onClickDelete={onClickDelete} />);

    const deleteButton = screen.getByTestId('delete-note-btn');
    fireEvent.click(deleteButton);

    expect(onClickDelete).toHaveBeenCalledWith(mockNote);
  });
});
