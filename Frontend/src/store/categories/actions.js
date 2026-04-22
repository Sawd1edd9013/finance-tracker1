import {
  CATEGORIES_FAILURE,
  CATEGORIES_REQUEST,
  CATEGORIES_SUCCESS,
} from "../action-types";

export const categoriesRequest = () => ({
  type: CATEGORIES_REQUEST,
});

export const categoriesSuccess = (items) => ({
  type: CATEGORIES_SUCCESS,
  payload: items,
});

export const categoriesFailure = (error) => ({
  type: CATEGORIES_FAILURE,
  payload: error,
});
