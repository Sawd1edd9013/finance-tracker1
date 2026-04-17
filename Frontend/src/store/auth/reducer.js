import {
  AUTH_REQUEST,
  AUTH_SUCCESS,
  AUTH_FAILURE,
  AUTH_LOGOUT,
  AUTH_CLEAR_ERROR,
} from "../action-types";

const initialState = {
  user: null,
  isLoading: false,
  isAuthChecked: false,
  error: null,
};

export default function authReducer(state = initialState, action) {
  switch (action.type) {
    case AUTH_REQUEST:
      return {
        ...state,
        isLoading: true,
        error: null,
      };

    case AUTH_SUCCESS:
      return {
        ...state,
        user: action.payload,
        isLoading: false,
        isAuthChecked: true,
        error: null,
      };

    case AUTH_FAILURE:
      return {
        ...state,
        isLoading: false,
        isAuthChecked: true,
        error: action.payload,
      };

    case AUTH_LOGOUT:
      return {
        ...initialState,
        isAuthChecked: true,
      };

    case AUTH_CLEAR_ERROR:
      return {
        ...state,
        error: null,
      };

    default:
      return state;
  }
}
