import {
  ACCOUNTS_FAILURE,
  ACCOUNTS_REQUEST,
  ACCOUNTS_SUCCESS,
} from "../action-types";

export const accountsRequest = () => ({
  type: ACCOUNTS_REQUEST,
});

export const accountsSuccess = (items) => ({
  type: ACCOUNTS_SUCCESS,
  payload: items,
});

export const accountsFailure = (error) => ({
  type: ACCOUNTS_FAILURE,
  payload: error,
});
