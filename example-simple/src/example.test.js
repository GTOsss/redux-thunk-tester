import React from 'react';
import {createStore, applyMiddleware, combineReducers} from 'redux';
import {asyncThunkWithRequest, reducer} from './example';
import ReduxThunkTester from 'redux-thunk-tester';
import thunk from 'redux-thunk';

const createMockStore = () => {
  const reduxThunkTester = new ReduxThunkTester();

  const store = createStore(
    combineReducers({exampleSimple: reducer}),
    applyMiddleware(
      reduxThunkTester.createReduxThunkHistoryMiddleware(),
      thunk
    ),
  );

  return {reduxThunkTester, store};
};

describe('Simple example.', () => {
  test('Success request.', async () => {
    const {store, reduxThunkTester: {getActionHistoryAsync, getActionHistoryStringifyAsync}} = createMockStore();

    store.dispatch(asyncThunkWithRequest());

    const actionHistory = await getActionHistoryAsync(); // need to wait async thunk (all inner dispatch)

    expect(actionHistory).toEqual([
      {type: 'TOGGLE_LOADING', payload: true},
      {type: 'SOME_BACKEND_REQUEST', payload: 'success response'},
      {type: 'TOGGLE_LOADING', payload: false},
    ]);

    expect(store.getState().exampleSimple).toEqual({
      loading: false,
      result: 'success response'
    });

    console.log(await getActionHistoryStringifyAsync({withColor: true}));
  });

  test('Change input actions', () => {
    const {reduxThunkTester: {getActionHistoryStringify}, store} = createMockStore();

    store.dispatch({type: 'TEST_ACTION', payload: 1});
    store.dispatch({type: 'TEST_ACTION', payload: 2});
    store.dispatch({type: 'TEST_ACTION', payload: 3});

    console.log(getActionHistoryStringify({withColor: true}));
  })
});
