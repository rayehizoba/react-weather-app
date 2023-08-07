export const types = {
  CLEAR_ERRORS: 'APP/CLEAR_ERRORS',
} as const;

export interface AppState {
}

const initialState: AppState = {};

export type Action = { type: typeof types.CLEAR_ERRORS };

export default function reducer(state: AppState = initialState, action: Action) {
  switch (action.type) {
    default:
      return state;
  }
}
