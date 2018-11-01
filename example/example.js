import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

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
export { reducer };
