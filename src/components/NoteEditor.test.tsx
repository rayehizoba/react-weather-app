import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import NoteEditor from './NoteEditor';
import {NoteResource} from "../lib/types";

describe('NoteEditor', () => {
  it('should render NoteEditor with initial data', () => {
    const mockNote: NoteResource = {
      id: '1',
      title: 'Test Note',
      note: 'This is a test note',
      created_at: Date.now(),
      updated_at: Date.now(),
    };

    render(
      <NoteEditor
        show={true}
        note={mockNote}
        onClose={() => {}}
        onSubmit={(data) => {}}
      />
    );

    const titleInput = screen.getByLabelText('note-title-input');
    const noteInput = screen.getByLabelText('note-note-input');

    expect(titleInput).toHaveValue(mockNote.title);
    expect(noteInput).toHaveValue(mockNote.note);
  });

  it('should update form data when inputs change', () => {
    render(<NoteEditor show={true} note={null} onClose={() => {}} onSubmit={() => {}} />);

    const titleInput = screen.getByLabelText('note-title-input');
    const noteInput = screen.getByLabelText('note-note-input');

    fireEvent.change(titleInput, { target: { value: 'New Title' } });
    fireEvent.change(noteInput, { target: { value: 'New Note Content' } });

    expect(titleInput).toHaveValue('New Title');
    expect(noteInput).toHaveValue('New Note Content');
  });

  it('should validate form data when form is submitted',  () => {
    const onSubmit = jest.fn();
    render(<NoteEditor show={true} note={null} onClose={() => {}} onSubmit={onSubmit} />);

    const saveButton = screen.getByText('Save');
    fireEvent.click(saveButton);

    expect(onSubmit).toHaveBeenCalledTimes(0);

    const titleValidationError = screen.getByText('The title field is required.');
    expect(titleValidationError).toBeInTheDocument();

    const noteValidationError = screen.getByText('The note field is required.');
    expect(noteValidationError).toBeInTheDocument();
  });

  it('should call onSubmit when form is submitted',  () => {
    const onSubmit = jest.fn();
    render(<NoteEditor show={true} note={null} onClose={() => {}} onSubmit={onSubmit} />);

    const titleInput = screen.getByLabelText('note-title-input');
    const noteInput = screen.getByLabelText('note-note-input');

    fireEvent.change(titleInput, { target: { value: 'New Title' } });
    fireEvent.change(noteInput, { target: { value: 'New Note Content' } });

    const saveButton = screen.getByText('Save');
    fireEvent.click(saveButton);

    expect(onSubmit).toHaveBeenCalledTimes(1);
  });

  it('should call onClose when Cancel button is clicked', () => {
    const onClose = jest.fn();
    render(<NoteEditor show={true} note={null} onClose={onClose} onSubmit={() => {}} />);

    const cancelButton = screen.getByText('Cancel');
    fireEvent.click(cancelButton);

    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
