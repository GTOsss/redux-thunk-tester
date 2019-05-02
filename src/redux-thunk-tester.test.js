import {createStore, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';
import reduxMiddleware from './redux-middleware';
import ReduxThunkTester from './';

function counter(state = 0, action) {
  switch (action.type) {
    case 'INCREMENT':
      return state + 1;
    case 'DECREMENT':
      return state - 1;
    default:
      return state
  }
}

const getNewStore = () => {
  const reduxThunkTester = new ReduxThunkTester();
  const store = createStore(
    counter,
    applyMiddleware(
      reduxThunkTester.createReduxThunkHistoryMiddleware(),
      thunk,
    ),
  );

  return {reduxThunkTester, store};
};

const sleep = (ms) => new Promise((resolve) => {
  setTimeout(resolve, ms);
});

const incrementAction = () => ({type: 'INCREMENT'});

const incrementActionAsync = () => async (dispatch) => {
  dispatch(incrementAction());
};

const incrementActionAsyncWithDelay = () => async (dispatch) => {
  await sleep(200);
  dispatch(incrementAction());
};

const incrementActionAsyncWillReturnState = () => async (dispatch, getState) => {
  dispatch(incrementAction());
  return getState();
};

describe('redux after connect store-history middleware.', () => {
  test('Dispatch return object for object-action.', () => {
    const {store} = getNewStore();
    expect(store.dispatch(incrementAction())).toEqual(incrementAction());
  });

  test('Dispatch return promise for thunk-action.', () => {
    const {store} = getNewStore();
    expect(store.dispatch(incrementActionAsync())).toBeInstanceOf(Promise);
  });

  test('Dispatch return promise for thunk-action with delay.', async () => {
    const {store} = getNewStore();
    const resultDispatch = store.dispatch(incrementActionAsyncWithDelay());
    expect(resultDispatch).toBeInstanceOf(Promise);
    await resultDispatch;
    console.log('delay should be >= 200ms');
  });

  test('Async increment with delay. Test store.', async () => {
    const {store} = getNewStore();
    await store.dispatch(incrementActionAsyncWithDelay());
    expect(store.getState()).toEqual(1);
  });

  test('Dispatch thunk that return state', async () => {
    const {store} = getNewStore();
    expect(await store.dispatch(incrementActionAsyncWillReturnState())).toEqual(1);
    expect(store.getState()).toEqual(1);
  });
});

describe('redux-middleware', () => {
  test('createReduxThunkHistoryMiddleware', async() => {
    const history = [];
    const getState = jest.fn();
    const dispatch = jest.fn();
    const next = jest.fn();
    const action = {type: 'TEST_ACTION'};
    const actionThunk = () => async (dispatch, getState) => {
      getState();
      dispatch(action);
    };

    const actionThunkWithDispatchThunk = () => async (dispatch, getState) => {
      getState();
      dispatch(actionThunk);
    };

    const middleware = reduxMiddleware(history);
    const middlewareInner = middleware({dispatch, getState});
    const middlewareNext = middlewareInner(next);

    expect(typeof middleware).toEqual('function');
    expect(typeof middlewareInner).toEqual('function');
    expect(typeof middlewareNext).toEqual('function');

    expect(middlewareNext(action)).toEqual(undefined);
    expect(next.mock.calls).toEqual([[action]]);

    next.mockClear();

    middlewareNext(actionThunk());
    expect(next.mock.calls).toEqual([[action]]);
    expect(getState.mock.calls.length).toEqual(1);
    expect(await Promise.all(history)).toEqual([action, action]);
    expect(middlewareNext(actionThunk())).toBeInstanceOf(Promise);

    history.splice(0, history.length);
    middlewareNext(incrementActionAsyncWithDelay());
    expect(history[0]).toBeInstanceOf(Promise);
  });
});

describe('redux-thunk-tester', () => {
  test('getActionHistory with await dispatch', async () => {
    const {store, reduxThunkTester: {getActionHistory}} = getNewStore();
    await store.dispatch(incrementActionAsyncWithDelay());
    expect(getActionHistory()[0]).toBeInstanceOf(Promise);
  });

  test('getActionHistory without await dispatch', () => {
    const {store, reduxThunkTester: {getActionHistory}} = getNewStore();
    expect(store.dispatch(incrementAction())).toEqual(incrementAction());
    expect(store.dispatch(incrementActionAsync())).toBeInstanceOf(Promise);
    expect(store.dispatch(incrementActionAsyncWithDelay())).toBeInstanceOf(Promise);
    expect(getActionHistory().length).toEqual(3);
    expect(getActionHistory()[0]).toEqual(incrementAction());
    expect(getActionHistory()[1]).toBeInstanceOf(Promise);
    expect(getActionHistory()[2]).toBeInstanceOf(Promise);
  });

  test('getActionHistory: call dispatch with function', () => {
    const {store, reduxThunkTester: {getActionHistory}} = getNewStore();
    store.dispatch(incrementAction);
    expect(getActionHistory()[0]).toBeInstanceOf(Promise);
  });

  test('getActionHistory: call dispatch with thunk with delay', () => {
    const {store, reduxThunkTester: {getActionHistory}} = getNewStore();
    store.dispatch(incrementActionAsyncWithDelay());
    expect(getActionHistory()[0]).toBeInstanceOf(Promise);
  });

  test('getActionHistory: object action', () => {
    const {store, reduxThunkTester: {getActionHistory}} = getNewStore();
    store.dispatch(incrementAction());
    expect(getActionHistory()).toEqual([incrementAction()])
  });

  test('getActionHistoryAsync', async () => {
    const {store, reduxThunkTester: {getActionHistoryAsync}} = getNewStore();
    expect(store.dispatch(incrementAction())).toEqual(incrementAction());
    expect(store.dispatch(incrementActionAsync())).toBeInstanceOf(Promise);
    expect(store.dispatch(incrementActionAsyncWithDelay())).toBeInstanceOf(Promise);
    const history = await getActionHistoryAsync();
    expect(history.length).toEqual(3);
    expect(history)
      .toEqual([incrementAction(), incrementAction(), incrementAction()]);
  });

  test('getActionHistoryStringify', () => {
    const {store, reduxThunkTester: {getActionHistoryStringify}} = getNewStore();
    const testActionFirst = {type: 'TEST_ACTION_FIRST', payload: {value: 'test'}};
    const testActionSecond = {type: 'TEST_ACTION_SECOND', payload: {value: 'test'}};
    store.dispatch(testActionFirst);
    store.dispatch(testActionSecond);
    expect(getActionHistoryStringify({withColor: false})).toMatchSnapshot();
    expect(getActionHistoryStringify({inlineLimit: 4, withColor: false})).toMatchSnapshot();
    console.log(getActionHistoryStringify({withColor: true}));
  });

  test('getActionHistoryStringifyAsync', async () => {
    const {store, reduxThunkTester: {getActionHistoryStringifyAsync}} = getNewStore();
    expect(store.dispatch(incrementAction())).toEqual(incrementAction());
    expect(store.dispatch(incrementActionAsync())).toBeInstanceOf(Promise);
    expect(store.dispatch(incrementActionAsyncWithDelay())).toBeInstanceOf(Promise);
    expect(await getActionHistoryStringifyAsync({withColor: false})).toMatchSnapshot();
    expect(await getActionHistoryStringifyAsync({inlineLimit: 4, withColor: false})).toMatchSnapshot();
    console.log(await getActionHistoryStringifyAsync({withColor: true}));

  });

  test('actionStringify', () => {
    const testAction = {type: 'TEST_ACTION', payload: {value: 'test'}};
    const {actionStringify} = ReduxThunkTester;
    expect(actionStringify(testAction, {withColor: false})).toMatchSnapshot();
    expect(actionStringify(testAction, {inlineLimit: 4, withColor: false})).toMatchSnapshot();
    console.log(actionStringify(testAction, {withColor: true}));
  });

  test('clearActionHistory', () => {
    const {store, reduxThunkTester: {
      clearActionHistory, getActionHistoryStringify, getActionHistory,
    }} = getNewStore();
    const testActionFirst = {type: 'TEST_ACTION_FIRST', payload: {value: 'test'}};
    const testActionSecond = {type: 'TEST_ACTION_SECOND', payload: {value: 'test'}};
    store.dispatch(testActionFirst);
    clearActionHistory();
    store.dispatch(testActionSecond);
    expect(getActionHistoryStringify({withColor: false})).toMatchSnapshot();
    expect(getActionHistory()).toEqual([testActionSecond]);
  });
});

