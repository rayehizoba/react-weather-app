import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import FavoriteButton from './FavoriteButton';

describe('FavoriteButton', () => {
  it('renders correctly when not active or busy', () => {
    const mockOnClick = jest.fn();
    render(<FavoriteButton active={false} busy={false} onClick={mockOnClick} />);

    // Check if the "Add" text is rendered
    const addButton = screen.getByText('Add');
    expect(addButton).toBeInTheDocument();

    // Check if the button is enabled and not busy
    const buttonElement = screen.getByRole('button');
    expect(buttonElement).toBeEnabled();
    expect(buttonElement).not.toHaveClass('opacity-50');
  });

  it('renders correctly when active', () => {
    const mockOnClick = jest.fn();
    render(<FavoriteButton active={true} busy={false} onClick={mockOnClick} />);

    // Check if the "Added" text is rendered
    const addedButton = screen.getByText('Added');
    expect(addedButton).toBeInTheDocument();

    // Check if the star icon is the active variant
    const starIcon = screen.getByTestId('star-icon');
    expect(starIcon).toHaveClass('mdi-star text-sky-300/50');
  });

  it('renders correctly when busy', () => {
    const mockOnClick = jest.fn();
    render(<FavoriteButton active={false} busy={true} onClick={mockOnClick} />);

    // Check if the button is disabled and has opacity class
    const buttonElement = screen.getByRole('button');
    expect(buttonElement).toBeDisabled();
    expect(buttonElement).toHaveClass('opacity-50');
  });

  it('calls onClick when clicked', () => {
    const mockOnClick = jest.fn();
    render(<FavoriteButton active={false} busy={false} onClick={mockOnClick} />);

    const buttonElement = screen.getByRole('button');
    fireEvent.click(buttonElement);

    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });
});
