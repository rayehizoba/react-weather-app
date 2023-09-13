import React from "react";
import {render, screen} from "@testing-library/react";
import FavoritesItem from "./FavoritesItem";

describe('FavoritesItem', () => {
  const mockForecast = require('../mocks/forecast-resource-mock.json');
  const mockLocation = require('../mocks/location-resource-mock.json');

  it('renders correctly with active state', () => {
    render(<FavoritesItem forecast={mockForecast} location={mockLocation} isActive />);

    const locationElement = screen.getByText(mockLocation.name);
    expect(locationElement).toBeInTheDocument();

    const favoritesItemElement = screen.getByTestId(`favorites-item-${mockLocation.id}`);
    expect(favoritesItemElement).toHaveClass('before:bg-sky-200/25');
  });

  it('scrolls into view on render with active state', () => {
    const scrollIntoViewMock = jest.fn();
    window.HTMLElement.prototype.scrollIntoView = scrollIntoViewMock;

    render(<FavoritesItem forecast={mockForecast} location={mockLocation} isActive />);

    expect(scrollIntoViewMock).toHaveBeenCalledWith({ block: 'center' });
  });
})
