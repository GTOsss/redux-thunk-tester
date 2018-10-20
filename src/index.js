import Colors from 'colors/safe';
import stringifyObject from 'stringify-object';

/**
 * @param {string} typeArg Actions type
 * @param {*} metaArg Action meta
 * @param {*} payloadArg Action payload
 * @param {number} inlineLimit Limit char in string line.
 * @param {boolean} withColor If true will be add color.
 * @returns {string} String action.
 */
const actionStringify = ({
  type: typeArg, meta: metaArg, payload: payloadArg,
}, { inlineLimit = 50, withColor = true } = {}) => {
  const stringifyConfig = { inlineCharacterLimit: inlineLimit };
  const type = withColor ? Colors.green(typeArg) : typeArg;
  const meta = metaArg ? `\n meta: ${stringifyObject(metaArg, stringifyConfig)}` : '';
  const payload = payloadArg ? `\n payload: ${stringifyObject(payloadArg, stringifyConfig)}` : '';
  return `${type}${meta}${payload}`;
};

/**
 * @param {array} actions Actions history.
 * @param {number} inlineLimit How many chat can use for line.
 * @param {boolean} withColor If need color.
 * @returns {string} String.
 */
const actionHistoryStringify = (actions, { inlineLimit = 50, withColor = true } = {}) => actions
  .map((action) => actionStringify(action, { inlineLimit, withColor })).join(',\n');

const sliceLastHistory = (actionHistory, prevSliceLength) => actionHistory
  .slice(prevSliceLength, actionHistory.length);

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

const reduxThunkHistory = (storeHistory) => ({
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

module.exports = {
  actionStringify,
  reduxThunkHistory,
  actionHistoryStringify,
  sliceLastHistory,
};
