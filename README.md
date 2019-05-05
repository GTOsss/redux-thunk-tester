# Redux thunk tester
Useful for tests when using synchronous/asynchronous redux actions.
```
npm i --save-dev redux-thunk-tester
```

# Methods
### createReduxThunkHistoryMiddleware
First need to create a store with reduxThunkTester middleware and create an instance of ReduxThunkTester.

```
import ReduxThunkTester from 'redux-thunk-tester'.

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

```
Now reduxThunkTester have next methods:

```
type StringifyOptions = {
  inlineLimit?: number,
  withColor?: boolean,
}

getActionHistory(): Action[] | Promise<Action>[];
getActionHistoryAsync(): Promise<Action>[];
clearActionHistory(): Action[] | Promise<Action>[];
getActionHistoryStringify(options?: StringifyOptions): string;
getActionHistoryStringifyAsync(options?: StringifyOptions): Promise<string>;
```
	
### getActionHistory(): Array of actions
Return array of actions. Use when not using thunk (async actions), for async actions use getActionHistoryAsync.
	
Example:
```
test('Test action history', () => {
  const {reduxThunkTester: {getActionHistory}, store} = createMockStore();
  
  store.dispatch({type: 'TEST_ACTION_1'});	
  store.dispatch({type: 'TEST_ACTION_2'});	
 
  expect(getActionHistory).toEqual([
   {type: 'TEST_ACTION_1'},
   {type: 'TEST_ACTION_2'},
  ])
}) 
```

### getActionHistoryAsync(): Array of promise
Return array of promise. Use when using thunk (async actions).
Example: 
```
test('Test action history', async () => {
  const {reduxThunkTester: {getActionHistoryAsync}, store} = createMockStore();
  
  const someAsyncAction = () => async (dispatch) => {
    // here may be await for some async request
    store.dispatch({type: 'TEST_ACTION', payload: 1});	
    store.dispatch({type: 'TEST_ACTION', payload: 2});	
    store.dispatch({type: 'TEST_ACTION', payload: 3});	
  }

  store.dispatch(someAsyncAction());
  
  expect(await getActionHistoryAsync).toEqual([
    {type: 'TEST_ACTION', payload: 1},
    {type: 'TEST_ACTION', payload: 2},
    {type: 'TEST_ACTION', payload: 3},
  ])
}) 
```

### clearActionHistory()
Call this method when you want clear action history.
Example: 
```
test('Test action history', () => {
  const {reduxThunkTester: {getActionHistory, clearActionHistory}, store} = createMockStore();
  
  store.dispatch({type: 'TEST_ACTION_1'});	
  clearActionHistory();
  store.dispatch({type: 'TEST_ACTION_2'});	
 
  expect(getActionHistory).toEqual([
   {type: 'TEST_ACTION_2'},
  ])
}) 
```

### getActionHistoryStringify([, params]): string
Return string with action history. Useful for debugging. Use when not using thunk (async actions), for async actions use getActionHistoryStringifyAsync.
example:

```
test('Change input actions', () => {
  const {reduxThunkTester: {getActionHistoryStringify}, store} = createMockStore();
  
  store.dispatch({type: 'TEST_ACTION', payload: 1});	
  store.dispatch({type: 'TEST_ACTION', payload: 2});	
  store.dispatch({type: 'TEST_ACTION', payload: 3});	
 
  console.log(getActionHistoryStringify({withColor: true}));
}) 
```
Result: 
![Screenshot result getActionHistoryStringify](https://raw.githubusercontent.com/GTOsss/redux-thunk-tester/master/readme-source/get-action-history.png)


### getActionHistoryStringifyAsync([, params]): Promise
Return string with action history. Useful for debugging. Use when use thunk (async actions).
example:

```
test('Change input actions', async () => {
  const {reduxThunkTester: {getActionHistoryStringifyAsync}, store} = createMockStore();
  
  store.dispatch({type: 'TEST_ACTION', payload: 1});	
  store.dispatch({type: 'TEST_ACTION', payload: 2});	
  store.dispatch({type: 'TEST_ACTION', payload: 3});	
 
  console.log(await getActionHistoryStringify({withColor: true}));
}) 
```
Result: 
![Screenshot result getActionHistoryStringify](https://raw.githubusercontent.com/GTOsss/redux-thunk-tester/master/readme-source/get-action-history.png)

### static actionStringify(action[, stringifyOptions])
Use when need output action in console. For example:
```
import ReduxThunkTester = 'redux-thunk-tester';

...

console.log(ReduxThunkTester.actionStringify({
  type: 'SOME_ACTION',
  payload: {message: 'some payload'},
}))
```

## Simple example
Repository: https://github.com/GTOsss/redux-thunk-tester/tree/master/example-simple/src

### example.js
```
const TOGGLE_LOADING = 'TOGGLE_LOADING';
const SOME_BACKEND_REQUEST = 'SOME_BACKEND_REQUEST';

const request = (ms) => new Promise((resolve) => {
  setTimeout(() => resolve('success response'), ms);
});

const resultRequestAction = (value) => ({ type: SOME_BACKEND_REQUEST, payload: value });
const toggleLoadingAction = (value) => ({ type: TOGGLE_LOADING, payload: value });


export const reducer = (state = {}, { type, payload } = {}) => {
  switch (type) {
    case TOGGLE_LOADING: return { ...state, loading: payload };
    case SOME_BACKEND_REQUEST: return { ...state, result: payload };
    default: return state;
  }
};

export const asyncThunkWithRequest = () => async (dispatch) => {
  try {
    dispatch(toggleLoadingAction(true));
    const result = await request(200);
    dispatch(resultRequestAction(result));
  } finally {
    dispatch(toggleLoadingAction(false));
  }
};
```

### example.test.js
```
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

    console.log(ReduxThunkTester.actionStringify(actionHistory[2]));
    console.log(await getActionHistoryStringifyAsync({withColor: true}));
  });
});

```

## Example for react
Repository: https://github.com/GTOsss/redux-thunk-tester/tree/master/example/src

### example.js:
```
const FOCUS = 'FOCUS';
const CHANGE = 'CHANGE';
const BLUR = 'BLUR';

const sleep = (ms) => new Promise((resolve) => { setTimeout(resolve, ms) });

const focusAction = () => ({ type: FOCUS });
const changeAction = (value) => ({ type: CHANGE, payload: { value } });
const blurAction = () => ({ type: BLUR });

const blurThunk = () => async (dispatch) => {
  await sleep(2000);
  dispatch(blurAction());
};

const reducer = (state = {}, { type, payload } = {}) => {
  switch (type) {
    case FOCUS: return { ...state, active: true };
    case CHANGE: return { ...state, value: payload.value };
    case BLUR: return { ...state, active: false };
    default: return state;
  }
};

class Example extends Component {
  onFocus = () => {
    this.props.focusAction();
  };

  onChange = (e) => {
    const { target: { value } } = e;
    this.props.changeAction(value);
  };

  onBlur = () => {
    this.props.blurThunk();
  };

  render() {
    return (
      <input type="text" onFocus={this.onFocus} onChange={this.onChange} onBlur={this.onBlur} />
    );
  }
}

const mapDispatchToProps = (dispatch) => ({
  focusAction: bindActionCreators(focusAction, dispatch),
  changeAction: bindActionCreators(changeAction, dispatch),
  blurThunk: bindActionCreators(blurThunk, dispatch)
});

export default connect(null, mapDispatchToProps)(Example);
```
### example.test.js

```
import React from 'react';
import {mount} from 'enzyme';
import {Provider} from 'react-redux';
import {createStore, applyMiddleware, combineReducers} from 'redux';
import stringifyObject from 'stringify-object';
import ReduxThunkTester from 'redux-thunk-tester';
import thunk from 'redux-thunk';
import ExampleConnectedComponent, {reducer} from './example';

const renderComponent = () => {
  const reduxThunkTester = new ReduxThunkTester();

  const store = createStore(
    combineReducers({example: reducer}),
    applyMiddleware(
      reduxThunkTester.createReduxThunkHistoryMiddleware(),
      thunk
    ),
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

  test('Change input: actions.', () => {
    const {component, reduxThunkTester: {
      clearActionHistory, getActionHistoryStringify
    }} = renderComponent();

    component.find('input').simulate('focus');
    clearActionHistory();
    component.find('input').simulate('change', {target: {value: 't'}});
    component.find('input').simulate('change', {target: {value: 'te'}});
    component.find('input').simulate('change', {target: {value: 'tes'}});
    component.find('input').simulate('change', {target: {value: 'test'}});

    console.log(getActionHistoryStringify({withColor: true}));
    expect(getActionHistoryStringify()).toMatchSnapshot();
  });

  test('Change input: store', () => {
    const {component, store, reduxThunkTester: {clearActionHistory}} = renderComponent();

    component.find('input').simulate('focus');
    clearActionHistory();
    component.find('input').simulate('change', {target: {value: 't'}});
    component.find('input').simulate('change', {target: {value: 'te'}});
    component.find('input').simulate('change', {target: {value: 'tes'}});
    component.find('input').simulate('change', {target: {value: 'test'}});

    expect(store.getState().example).toEqual({active: true, value: 'test'});
    console.log(stringifyObject(store.getState().example));
  });

  test('Blur input: async action', async () => {
    const {component, reduxThunkTester: {
      clearActionHistory, getActionHistoryStringifyAsync
    }} = renderComponent();

    component.find('input').simulate('focus');
    component.find('input').simulate('change', {target: {value: 't'}});
    component.find('input').simulate('change', {target: {value: 'te'}});
    component.find('input').simulate('change', {target: {value: 'tes'}});
    component.find('input').simulate('change', {target: {value: 'test'}});
    clearActionHistory();
    component.find('input').simulate('blur');

    console.log(await getActionHistoryStringifyAsync({withColor: true}));
    expect(await getActionHistoryStringifyAsync()).toMatchSnapshot();
  });

  test('Blur input: store', async () => {
    const {component, store, reduxThunkTester: {getActionHistoryAsync}} = renderComponent();

    component.find('input').simulate('focus');
    component.find('input').simulate('change', {target: {value: 't'}});
    component.find('input').simulate('change', {target: {value: 'te'}});
    component.find('input').simulate('change', {target: {value: 'tes'}});
    component.find('input').simulate('change', {target: {value: 'test'}});
    component.find('input').simulate('blur');

    await getActionHistoryAsync(); // need to wait all thunk.

    expect(store.getState().example).toEqual({active: false, value: 'test'});
    console.log(store.getState().example);
  });
});


```

### example.test.js results:
![Screenshot result 1](https://raw.githubusercontent.com/GTOsss/redux-thunk-tester/master/readme-source/1.png)
![Screenshot result 2](https://raw.githubusercontent.com/GTOsss/redux-thunk-tester/master/readme-source/2.png)
![Screenshot result 3](https://raw.githubusercontent.com/GTOsss/redux-thunk-tester/master/readme-source/3.png)
![Screenshot result 4](https://raw.githubusercontent.com/GTOsss/redux-thunk-tester/master/readme-source/4.png)
![Screenshot result 5](https://raw.githubusercontent.com/GTOsss/redux-thunk-tester/master/readme-source/5.png)
![Screenshot result 6](https://raw.githubusercontent.com/GTOsss/redux-thunk-tester/master/readme-source/6.png)
