const createReduxThunkHistoryMiddleware = (actions, promises) => ({
  dispatch, getState,
}) => (next) => (action) => {
  if (typeof action === 'function') {
    const result = action(dispatch, getState);
    if (result instanceof Promise) {
      promises.push(result);
    } else if (typeof result === 'object') {
      history.push(result);
    }

    return result;
  }
  actions.push(action);
  return next(action);
};

export default createReduxThunkHistoryMiddleware;
