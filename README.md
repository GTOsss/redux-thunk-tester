# Redux thunk tester
Useful for integration tests when using synchronous/asynchronous redux actions.
## Example
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

```

### example.test.js results:
![Screenshot result 1](https://raw.githubusercontent.com/GTOsss/redux-thunk-tester/master/readme-source/1.png)
![Screenshot result 2](https://raw.githubusercontent.com/GTOsss/redux-thunk-tester/master/readme-source/2.png)
![Screenshot result 3](https://raw.githubusercontent.com/GTOsss/redux-thunk-tester/master/readme-source/3.png)
![Screenshot result 4](https://raw.githubusercontent.com/GTOsss/redux-thunk-tester/master/readme-source/4.png)
![Screenshot result 5](https://raw.githubusercontent.com/GTOsss/redux-thunk-tester/master/readme-source/5.png)
![Screenshot result 6](https://raw.githubusercontent.com/GTOsss/redux-thunk-tester/master/readme-source/6.png)
