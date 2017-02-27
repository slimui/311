// @flow
/* global window */

import { createStore, compose, applyMiddleware, combineReducers } from 'redux';
import type { Store as ReduxStore, Reducer, Dispatch as ReduxDispatch } from 'redux';

import keys from './keys';
import request from './request';

import type { State as KeysState, Action as KeysAction } from './keys';
import type { State as RequestState, Action as RequestAction } from './request';

import type { RequestAdditions } from '../../server/next-handlers';

export type State = {|
  keys: KeysState,
  request: RequestState,
|};

export type Action = KeysAction | RequestAction;
export type Dispatch = ReduxDispatch<Action>;

export type Store = ReduxStore<State, Action>;

// For the browser, we keep a singleton store that can be re-used across pages.
// A module global is the only mechanism for sharing between Next.js pages.
let browserStore = null;

// Factored out to allow for injecting test dependencies and state while
// maintaining the same middleware.
export function makeStore(initialState: ?State = undefined): Store {
  const reducer: Reducer<State, Action> = combineReducers({
    keys,
    request,
  });

  // Support for Redux Devtools Extension: https://github.com/zalmoxisus/redux-devtools-extension
  // eslint-disable-next-line no-underscore-dangle
  const composeEnhancers = (process.browser && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) || compose;

  const enhancers = composeEnhancers(
    applyMiddleware(),
  );

  if (initialState) {
    return createStore(reducer, initialState, enhancers);
  } else {
    return createStore(reducer, enhancers);
  }
}

/**
 * Returns a Redux store for this application. For the server, always returns a
 * fresh store with the given initialState. On the browser, will always return
 * the same store and initialState is ignored after the first call.
 *
 * req is the Node request (expected to contain injected dependencies for server
 * data fetching) that should be provided when creating the store for the
 * server’s getInitialProps calls. Can be null when server rendering or on the
 * client.
 */
export default function getStore(req: ?RequestAdditions, initialState: ?State = undefined): Store {
  if (process.browser && browserStore) {
    return browserStore;
  }

  const store = makeStore(initialState);

  if (process.browser) {
    browserStore = store;
  }

  return store;
}