import {
  ACCOUNTS_FAILURE,
  ACCOUNTS_REQUEST,
  ACCOUNTS_SUCCESS,
} from "../action-types";

const initialState = {
  items: [],
  isLoading: false,
  isLoaded: false,
  error: null,
};

export default function accountsReducer(state = initialState, action) {
  switch (action.type) {
    case ACCOUNTS_REQUEST:
      return {
        ...state,
        isLoading: true,
        error: null,
      };

    case ACCOUNTS_SUCCESS:
      return {
        ...state,
        items: action.payload,
        isLoading: false,
        isLoaded: true,
        error: null,
      };

    case ACCOUNTS_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      };

    default:
      return state;
  }
}
