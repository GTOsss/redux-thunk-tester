import Colors from 'colors/safe';
import stringifyObject from 'stringify-object';
import createReduxThunkHistoryMiddleware from './redux-middleware';

class ReduxThunkTester {
  constructor() {
    this.actions = [];
  }

  /**
   * @param {string} typeArg Actions type
   * @param {*} metaArg Action meta
   * @param {*} payloadArg Action payload
   * @param {number} inlineLimit Limit char in string line.
   * @param {boolean} withColor If true will be add color.
   * @returns {string} String action.
   */
  static actionStringify = ({
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
   * @param {number} inlineLimit How many char can use for line.
   * @param {boolean} withColor If need color.
   * @returns {string} String.
   */
  getActionHistoryStringify = ({ inlineLimit = 50, withColor = false } = {}) => this.actions
    .map((action) => ReduxThunkTester.actionStringify(action, { inlineLimit, withColor }))
    .join(',\n');

  // /**
  //  * @param {array} actions Actions history.
  //  * @param {number} inlineLimit How many char can use for line.
  //  * @param {boolean} withColor If need color.
  //  * @returns {string} String.
  //  */
  // getActionHistoryStringifyAsync = async (
  //   { inlineLimit = 50, withColor = false } = {}
  // ) => (await Promise.all(this.actions))
  //   .map((action) => ReduxThunkTester.actionStringify(action, { inlineLimit, withColor }))
  //   .join(',\n');

  /**
   * Get actions
   * @returns {Array} Array of actions or promises
   */
  getActionHistory = () => this.actions;

  // /**
  //  * Get actions
  //  * @returns {Array} Array of actions
  //  */
  // getActionHistoryAsync = async () => (await Promise.all(this.actions));

  /**
   * Clear actions history.
   * @returns {Array} Cleared actions.
   */
  clearActionHistory = () => this.actions.splice(0, this.actions.length);

  /**
   * Function for "applyMiddleware" of redux.
   */
  createReduxThunkHistoryMiddleware = () => createReduxThunkHistoryMiddleware(this.actions) ;
}

export default ReduxThunkTester;
