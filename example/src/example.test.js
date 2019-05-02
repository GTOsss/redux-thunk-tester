import React from 'react';
import {mount} from 'enzyme';
import {Provider} from 'react-redux';
import {createStore, applyMiddleware, combineReducers} from 'redux';
import stringifyObject from 'stringify-object';
import ReduxThunkTester from 'redux-thunk-tester';
import ExampleConnectedComponent, {reducer} from './example';

const renderComponent = () => {
  const reduxThunkTester = new ReduxThunkTester();

  const store = createStore(
    combineReducers({example: reducer}),
    undefined,
    applyMiddleware(reduxThunkTester.reduxThunkHistory),
  );

  const component = mount(<Provider store={store}><ExampleConnectedComponent /></Provider>);

  return {reduxThunkTester, component, store};
};

describe('Example.', () => {
  test('Render example.', () => {
    const {component} = renderComponent();
    expect(component).toMatchSnapshot();
  });

  test('Focus input: action', () => {
    const {component, reduxThunkTester: {getActionHistoryStringify}} = renderComponent();
    component.find('input').simulate('focus');
    expect(getActionHistoryStringify()).toMatchSnapshot();
    console.log(getActionHistoryStringify({withColor: true}));
  });

  test('Focus input: store', () => {
    const {component, store} = renderComponent();
    component.find('input').simulate('focus');
    expect(stringifyObject(store.getState().example)).toMatchSnapshot();
    console.log(stringifyObject(store.getState().example));
  });

  // test('Change input: actions.', () => {
  //   clearActionHistory();
  //   exampleConnectedComponent.find('input').simulate('change', {target: {value: 't'}});
  //   exampleConnectedComponent.find('input').simulate('change', {target: {value: 'te'}});
  //   exampleConnectedComponent.find('input').simulate('change', {target: {value: 'tes'}});
  //   exampleConnectedComponent.find('input').simulate('change', {target: {value: 'test'}});
  //   console.log(getActionHistoryStringify({withColor: true}));
  //   expect(getActionHistoryStringify()).toMatchSnapshot();
  // });
  //
  // test('Change input: store', () => {
  //   expect(stringifyObject(store.getState().example)).toMatchSnapshot();
  //   console.log(stringifyObject(store.getState().example));
  // });
  //
  // test('Blur input: async action', async () => {
  //   clearActionHistory();
  //   exampleConnectedComponent.find('input').simulate('blur');
  //   console.log(await getActionHistoryStringifyAsync({withColor: true}));
  //   expect(await getActionHistoryStringifyAsync()).toMatchSnapshot();
  // });
  //
  // test('Blur input: store', () => {
  //   expect(stringifyObject(store.getState().example)).toMatchSnapshot();
  //   console.log(stringifyObject(store.getState().example));
  // });
  //
  // test('input-store equal "test"', () => {
  //   const expectInputValue = 'test';
  //   const storeValue = store.getState().example.value;
  //   expect(expectInputValue).toEqual(storeValue);
  // });
  //
  // test('Render last state.', () => {
  //   expect(exampleConnectedComponent).toMatchSnapshot();
  // });
});
