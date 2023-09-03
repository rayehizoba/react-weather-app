import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import NotesList from './NotesList';
import {NoteResource} from "../lib/types";

describe('NotesList', () => {
  // Mocked notes data
  const mockNotes: NoteResource[] = [
    {
      id: '1',
      title: 'Test Note 1',
      note: 'This is a test note 1',
      created_at: Date.now(),
      updated_at: Date.now(),
    },
    {
      id: '2',
      title: 'Test Note 2',
      note: 'This is a test note 2',
      created_at: Date.now(),
      updated_at: Date.now(),
    },
  ];

  it('should render notes list', () => {
    render(
      <NotesList
        notes={mockNotes}
        onClickNew={() => {}}
        onClickEdit={() => {}}
        onClickDelete={() => {}}
      />
    );

    // Check if the "Notes" header is rendered
    const notesHeader = screen.getByText('2 Notes');
    expect(notesHeader).toBeInTheDocument();

    // Check if the "New Note" button is rendered
    const newNoteButton = screen.getByText('New Note');
    expect(newNoteButton).toBeInTheDocument();

    // Check if each note item is rendered
    mockNotes.forEach((note) => {
      const titleElement = screen.getByText(note.title);
      expect(titleElement).toBeInTheDocument();

      const noteElement = screen.getByText(note.note);
      expect(noteElement).toBeInTheDocument();
    });

    // Check if the "No notes created" message is not rendered
    const emptyStateMessage = screen.queryByText('No notes created');
    expect(emptyStateMessage).not.toBeInTheDocument();

    // Check if the empty state is not rendered
    const emptyState = screen.queryByTestId('empty-state');
    expect(emptyState).not.toBeInTheDocument();
  });

  it('should render empty state when no notes are provided', () => {
    const { getByText, getByTestId } = render(
      <NotesList
        notes={[]}
        onClickNew={() => {}}
        onClickEdit={() => {}}
        onClickDelete={() => {}}
      />
    );

    // Check if the "No notes created" message is rendered
    const emptyStateMessage = screen.getByText('No notes created');
    expect(emptyStateMessage).toBeInTheDocument();

    // Check if the empty state is rendered
    const emptyState = screen.getByTestId('empty-state');
    expect(emptyState).toBeInTheDocument();

    // Check if the "New Note" button is rendered
    const newNoteButton = screen.getByText('New Note');
    expect(newNoteButton).toBeInTheDocument();
  });

  it('should call onClickNew when "New Note" button is clicked', () => {
    const onClickNew = jest.fn();
    const { getByText } = render(
      <NotesList
        notes={mockNotes}
        onClickNew={onClickNew}
        onClickEdit={() => {}}
        onClickDelete={() => {}}
      />
    );

    // Click the "New Note" button
    const newNoteButton = getByText('New Note');
    fireEvent.click(newNoteButton);

    // Check if onClickNew is called
    expect(onClickNew).toHaveBeenCalled();
  });
});
