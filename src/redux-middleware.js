const createDispatchPromise = () => {
  let resolve;
  let reject;

  const promise = new Promise((res, rej) => {
    resolve = res;
    reject = rej;
  });

  return { promise, resolve, reject };
};

const dispatchInner = (dispatch, getState, next, resolve) => (action) => {
  if (typeof action === 'function') {
    return action(dispatchInner(dispatch, getState, next, resolve));
  }
  resolve(action);
  return next(action);
};

const createReduxThunkHistoryMiddleware = (storeHistory) => ({
  dispatch, getState,
}) => (next) => (action) => {
  if (typeof action === 'function') {
    const { promise, resolve } = createDispatchPromise();
    const asyncDispatch = dispatchInner(dispatch, getState, next, resolve);
    storeHistory.push(promise);
    return action(asyncDispatch, getState);
  }
  storeHistory.push(action);
  return next(action);
};

export default createReduxThunkHistoryMiddleware;
