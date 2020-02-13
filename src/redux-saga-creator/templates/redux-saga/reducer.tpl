
import {
  FETCH_'<NAMEOF>'_SUCCESS,
  FETCH_'<NAMEOF>'_FAILURE,

  UPDATE_'<NAMEOF>'_SUCCESS,
  UPDATE_'<NAMEOF>'_FAILURE,

  DELETE_'<NAMEOF>'_SUCCESS,
  DELETE_'<NAMEOF>'_FAILURE,

  CREATE_'<NAMEOF>'_SUCCESS,
  CREATE_'<NAMEOF>'_FAILURE
} from "../actions/'<nameOf>'ActionCreator";

const initialState = {
  
};

const '<nameOf>'Reducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_'<NAMEOF>'_SUCCESS: {
      const { payload } = action;
      return {
        ...state,
        payload,
      };
    }
    case FETCH_'<NAMEOF>'_FAILURE: {
      const { error } = action;
      return {
        ...state,
        error,
      };
    }
    case CREATE_'<NAMEOF>'_SUCCESS: {
      const { payload } = action;
      return {
        ...state,
        payload,
      };
    }
    case CREATE_'<NAMEOF>'_FAILURE: {
      const { error } = action;
      return {
        ...state,
        error,
      };
    }
    case UPDATE_'<NAMEOF>'_SUCCESS: {
      const { payload } = action;
      return {
        ...state,
        payload,
      };
    }
    case UPDATE_'<NAMEOF>'_FAILURE: {
      const { error } = action;
      return {
        ...state,
        error,
      };
    }
    case DELETE_'<NAMEOF>'_SUCCESS: {
      const { payload } = action;
      return {
        ...state,
        payload,
      };
    }
    case DELETE_'<NAMEOF>'_FAILURE: {
      const { error } = action;
      return {
        ...state,
        error,
      };
    }

    default:
      return state;
  }
};

export default '<nameOf>'Reducer;
