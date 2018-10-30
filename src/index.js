import Colors from 'colors/safe';
import stringifyObject from 'stringify-object';
import createReduxThunkHistory from './redux-middware';

let actions = [];

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
const getActionHistoryStringify = ({ inlineLimit = 50, withColor = false } = {}) => actions
  .map((action) => actionStringify(action, { inlineLimit, withColor })).join(',\n');

/**
 * Get actions
 * @returns {Array} Array of actions
 */
const getActionHistory = () => actions;

/**
 * Clear actions history.
 */
const clearActionHistory = () => {
  actions = [];
};

/**
 * Function for "applyMiddleware" of redux.
 */
const reduxThunkHistory = createReduxThunkHistory(actions);

export {
  actionStringify,
  getActionHistoryStringify,
  getActionHistory,
  clearActionHistory,
  reduxThunkHistory,
};
