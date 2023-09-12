import React from 'react';
import {render, fireEvent, screen, waitFor} from '@testing-library/react';
import NoteEditor from './NoteEditor';
import {NoteResource} from "../lib/types";

describe('NoteEditor', () => {
  it('should render NoteEditor with initial data', async () => {
    const mockNote: NoteResource = {
      id: '1',
      title: 'Test Note',
      note: 'This is a test note',
      created_at: Date.now(),
      updated_at: Date.now(),
    };

    render(<NoteEditor show={true} note={mockNote} onClose={jest.fn} onSubmit={jest.fn}/>);

    const titleInput = screen.getByLabelText('note-title-input');
    await waitFor(() => expect(titleInput).toHaveValue(mockNote.title));

    const noteInput = screen.getByLabelText('note-note-input');
    expect(noteInput).toHaveValue(mockNote.note);
  });

  it('should update form data when inputs change', async () => {
    render(<NoteEditor show={true} note={null} onClose={jest.fn} onSubmit={jest.fn}/>);

    const titleInput = screen.getByLabelText('note-title-input');
    const noteInput = screen.getByLabelText('note-note-input');

    fireEvent.change(titleInput, {target: {value: 'New Title'}});
    fireEvent.change(noteInput, {target: {value: 'New Note Content'}});

    await waitFor(() => expect(titleInput).toHaveValue('New Title'));
    expect(noteInput).toHaveValue('New Note Content');
  });

  it('should validate form data when form is submitted', async () => {
    const onSubmit = jest.fn();
    render(<NoteEditor show={true} note={null} onClose={jest.fn} onSubmit={onSubmit}/>);

    const saveButton = screen.getByText('Save');
    fireEvent.click(saveButton);

    await waitFor(() => expect(onSubmit).toHaveBeenCalledTimes(0));

    const titleValidationError = screen.getByText('The title field is required.');
    expect(titleValidationError).toBeInTheDocument();

    const noteValidationError = screen.getByText('The note field is required.');
    expect(noteValidationError).toBeInTheDocument();
  });

  it('should call onSubmit when form is submitted', async () => {
    const onSubmit = jest.fn();
    render(<NoteEditor show={true} note={null} onClose={jest.fn} onSubmit={onSubmit}/>);

    const titleInput = screen.getByLabelText('note-title-input');
    const noteInput = screen.getByLabelText('note-note-input');

    fireEvent.change(titleInput, {target: {value: 'New Title'}});
    fireEvent.change(noteInput, {target: {value: 'New Note Content'}});

    const saveButton = screen.getByText('Save');
    fireEvent.click(saveButton);

    await waitFor(() => expect(onSubmit).toHaveBeenCalledTimes(1));
  });

  it('should call onClose when Cancel button is clicked', async () => {
    const onClose = jest.fn();
    render(<NoteEditor show={true} note={null} onClose={onClose} onSubmit={jest.fn}/>);

    const cancelButton = screen.getByText('Cancel');
    fireEvent.click(cancelButton);

    await waitFor(() => expect(onClose).toHaveBeenCalledTimes(1));
  });
});
