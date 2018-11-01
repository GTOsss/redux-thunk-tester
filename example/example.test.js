import React from 'react';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware, combineReducers } from 'redux';
import ExampleConnectedComponent, { reducer } from './example';
import stringifyObject from 'stringify-object';
import {
  reduxThunkHistory, clearActionHistory,
  getActionHistoryStringify, getActionHistoryStringifyAsync,
} from 'redux-thunk-tester';

const store = createStore(
  combineReducers({ example: reducer }),
  undefined,
  applyMiddleware(reduxThunkHistory),
);

const exampleConnectedComponent = mount(<Provider store={store}><ExampleConnectedComponent /></Provider>);

describe('Example.', () => {
  test('Render example.', () => {
    expect(exampleConnectedComponent).toMatchSnapshot();
  });

  test('Focus input: action', () => {
    exampleConnectedComponent.find('input').simulate('focus');
    console.log(getActionHistoryStringify({ withColor: true }));
    expect(getActionHistoryStringify()).toMatchSnapshot();
  });

  test('Focus input: store', () => {
    clearActionHistory();
    expect(stringifyObject(store.getState().example)).toMatchSnapshot();
    console.log(stringifyObject(store.getState().example));
  });

  test('Change input: actions.', () => {
    clearActionHistory();
    exampleConnectedComponent.find('input').simulate('change', { target: { value: 't' } });
    exampleConnectedComponent.find('input').simulate('change', { target: { value: 'te' } });
    exampleConnectedComponent.find('input').simulate('change', { target: { value: 'tes' } });
    exampleConnectedComponent.find('input').simulate('change', { target: { value: 'test' } });
    console.log(getActionHistoryStringify({ withColor: true }));
    expect(getActionHistoryStringify()).toMatchSnapshot();
  });

  test('Change input: store', () => {
    expect(stringifyObject(store.getState().example)).toMatchSnapshot();
    console.log(stringifyObject(store.getState().example));
  });

  test('Blur input: async action', async () => {
    clearActionHistory();
    exampleConnectedComponent.find('input').simulate('blur');
    console.log(await getActionHistoryStringifyAsync({ withColor: true }));
    expect(await getActionHistoryStringifyAsync()).toMatchSnapshot();
  });

  test('Blur input: store', () => {
    expect(stringifyObject(store.getState().example)).toMatchSnapshot();
    console.log(stringifyObject(store.getState().example));
  });

  test('input-store equal "test"', () => {
    const expectInputValue = 'test';
    const storeValue = store.getState().example.value;
    expect(expectInputValue).toEqual(storeValue);
  });

  test('Render last state.', () => {
    expect(exampleConnectedComponent).toMatchSnapshot();
  });
});
