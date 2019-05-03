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
Example: https://github.com/GTOsss/redux-thunk-tester/tree/master/example/src

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
