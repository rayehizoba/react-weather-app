import React from 'react';
import { render, screen } from '@testing-library/react';
import ValidationErrorMessages from './ValidationErrorMessages';

describe('ValidationErrorMessages', () => {
  it('should render validation error messages when errors exist', () => {
    const errors = {
      field1: ['Error message 1', 'Error message 2'],
      field2: ['Error message 3'],
    };
    render(<ValidationErrorMessages errors={errors} name="field1" />);

    expect(screen.getByText('Error message 1')).toBeInTheDocument();
    expect(screen.getByText('Error message 2')).toBeInTheDocument();
  });

  it('should not render validation error messages when errors do not exist', () => {
    const errors = {
      field2: ['Error message 3'],
    };
    render(<ValidationErrorMessages errors={errors} name="field1" />);

    expect(screen.queryByText('Error message 1')).toBeNull();
  });

  it('should not render validation error messages when errors are for a different field', () => {
    const errors = {
      field1: ['Error message 1'],
      field2: ['Error message 2'],
    };
    render(<ValidationErrorMessages errors={errors} name="field3" />);

    expect(screen.queryByText('Error message 1')).toBeNull();
    expect(screen.queryByText('Error message 2')).toBeNull();
  });
});
