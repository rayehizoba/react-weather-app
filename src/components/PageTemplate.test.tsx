import React from 'react';
import { render, screen } from '@testing-library/react';
import PageTemplate from './PageTemplate';

// Mock renderSidenav function
const renderSidenav = () => <div data-testid="sidenav">Sidenav Content</div>;

describe('PageTemplate', () => {
  it('should render PageTemplate with default state', () => {
    render(
      <PageTemplate renderHeader={() => <div>Header</div>} renderSidenav={renderSidenav}>
        <div>Content</div>
      </PageTemplate>
    );

    // Header should be visible
    expect(screen.getByText('Header')).toBeInTheDocument();

    // Sidenav should be visible
    expect(screen.getByTestId('sidenav')).toBeInTheDocument();
  });
});
