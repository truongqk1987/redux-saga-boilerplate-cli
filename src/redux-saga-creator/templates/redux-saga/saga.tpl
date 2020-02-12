export const actionType = {
  FETCH_DATA_ASYNC: 'home/FETCH_DATA_ASYNC',
  FETCH_DATA_SUCCESS: 'home/FETCH_DATA_SUCCESS',
  FETCH_DATA_FAILURE: 'home/FETCH_DATA_FAILURE',
};

const initialState = {
  data: {},
};

const '<nameOf>'Reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionType.FETCH_DATA_SUCCESS: {
      const { data } = action.payload.results;
      return {
        ...state,
        data,
      };
    }

    default:
      return state;
  }
};

export default '<nameOf>'Reducer;
