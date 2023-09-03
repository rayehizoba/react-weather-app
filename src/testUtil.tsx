import type {RenderResult} from '@testing-library/react'
import {render} from '@testing-library/react'
import React from 'react'

import {RootState, setupStore} from "./store";
import {Provider} from "react-redux";

const defaultValue: RootState = {} as RootState;

export const TestRenderer = (
  ui: React.ReactElement,
  initialReduxStateValue: RootState = defaultValue
): RenderResult =>
  render(
    <Provider store={setupStore(initialReduxStateValue)}>
      {ui}
    </Provider>
  )
