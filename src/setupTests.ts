// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';
import 'jest-canvas-mock';
import ResizeObserverMock from "./mocks/resize-observer-mock";

jest.mock('@reactuses/core', () => ({
  useDebounce: (value: any) => value,
  useClickOutside: jest.fn,
  usePrevious: jest.fn,
}));

(window as any).HTMLElement.prototype.scrollIntoView = jest.fn();

(window as any).ResizeObserver = ResizeObserverMock;
