import React from 'react';
import {render, screen, fireEvent} from '@testing-library/react';
import SearchInput from './SearchInput';

describe('SearchInput', () => {
  it('renders without crashing', () => {
    render(<SearchInput onChange={() => {}}/>);
  });

  it('fetches results and displays them on input change', async () => {
    const mockResults = [
      {
        id: '1',
        name: 'Location 1',
        admin1: 'Admin 1',
        country: 'Country 1',
      },
      {
        id: '2',
        name: 'Location 2',
        admin1: 'Admin 2',
        country: 'Country 2',
      },
    ];

    jest.spyOn(window, 'fetch').mockResolvedValueOnce({
      ok: true,
      json: async () => ({results: mockResults}),
    } as Response);

    render(<SearchInput onChange={() => {}}/>);

    const inputElement = screen.getByLabelText('search-input') as HTMLInputElement;

    fireEvent.change(inputElement, {target: {value: 'Some query'}});

    const searchResultsElement = await screen.findByTestId('search-results');
    expect(searchResultsElement).toBeInTheDocument();

    const resultItems = screen.getAllByTestId('search-results-item');
    expect(resultItems.length).toBe(mockResults.length);

    mockResults.forEach((result, index) => {
      const resultElement = resultItems[index];
      expect(resultElement).toHaveTextContent(
        `${result.name}, ${result.admin1}, ${result.country}`
      );
    });
  });

  it('calls onChange with selected location on click', async () => {
    const mockResults = [
      {
        id: '1',
        name: 'Location 1',
        admin1: 'Admin 1',
        country: 'Country 1',
      },
      {
        id: '2',
        name: 'Location 2',
        admin1: 'Admin 2',
        country: 'Country 2',
      },
    ];

    jest.spyOn(window, 'fetch').mockResolvedValueOnce({
      ok: true,
      json: async () => ({results: mockResults}),
    } as Response);

    const onChangeMock = jest.fn();
    render(<SearchInput onChange={onChangeMock}/>);

    const inputElement = screen.getByLabelText('search-input') as HTMLInputElement;

    fireEvent.change(inputElement, {target: {value: 'Some query'}});

    const resultItems = await screen.findAllByTestId('search-results-item');
    fireEvent.click(resultItems[0]); // Click the first result item

    expect(onChangeMock).toHaveBeenCalledWith(mockResults[0]);
  });
});
