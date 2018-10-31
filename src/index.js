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
  .map((action) => actionStringify(action, { inlineLimit, withColor }))
  .join(',\n');

/**
 * @param {array} actions Actions history.
 * @param {number} inlineLimit How many chat can use for line.
 * @param {boolean} withColor If need color.
 * @returns {string} String.
 */
const getActionHistoryStringifyAsync = async (
  { inlineLimit = 50, withColor = false } = {}
) => (await Promise.all(actions))
  .map((action) => actionStringify(action, { inlineLimit, withColor }))
  .join(',\n');

/**
 * Get actions
 * @returns {Array} Array of actions or promises
 */
const getActionHistory = () => actions;

/**
 * Get actions
 * @returns {Array} Array of actions
 */
const getActionHistoryAsync = async () => (await Promise.all(actions));

/**
 * Clear actions history.
 * @returns {Array} Cleared actions.
 */
const clearActionHistory = () => actions.splice(0, actions.length);

/**
 * Function for "applyMiddleware" of redux.
 */
const reduxThunkHistory = createReduxThunkHistory(actions);

export {
  actionStringify,
  getActionHistoryStringify,
  getActionHistoryStringifyAsync,
  getActionHistory,
  getActionHistoryAsync,
  clearActionHistory,
  reduxThunkHistory,
};
