const TOGGLE_LOADING = 'TOGGLE_LOADING';
const SOME_BACKEND_REQUEST = 'SOME_BACKEND_REQUEST';

const request = (ms) => new Promise((resolve) => {
  setTimeout(() => resolve('success response'), ms);
});

const resultRequestAction = (value) => ({ type: SOME_BACKEND_REQUEST, payload: value });
const toggleLoadingAction = (value) => ({ type: TOGGLE_LOADING, payload: value });


export const reducer = (state = {}, { type, payload } = {}) => {
  switch (type) {
    case TOGGLE_LOADING: return { ...state, loading: payload };
    case SOME_BACKEND_REQUEST: return { ...state, result: payload };
    default: return state;
  }
};

export const asyncThunkWithRequest = () => async (dispatch) => {
  try {
    dispatch(toggleLoadingAction(true));
    const result = await request(200);
    dispatch(resultRequestAction(result));
  } finally {
    dispatch(toggleLoadingAction(false));
  }
};