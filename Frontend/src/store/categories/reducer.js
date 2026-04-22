import {
  CATEGORIES_FAILURE,
  CATEGORIES_REQUEST,
  CATEGORIES_SUCCESS,
} from "../action-types";

const initialState = {
  items: [],
  isLoading: false,
  isLoaded: false,
  error: null,
};

export default function categoriesReducer(state = initialState, action) {
  switch (action.type) {
    case CATEGORIES_REQUEST:
      return {
        ...state,
        isLoading: true,
        error: null,
      };

    case CATEGORIES_SUCCESS:
      return {
        ...state,
        items: action.payload,
        isLoading: false,
        isLoaded: true,
        error: null,
      };

    case CATEGORIES_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      };

    default:
      return state;
  }
}
