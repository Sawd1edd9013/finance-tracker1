import {
  AUTH_REQUEST,
  AUTH_SUCCESS,
  AUTH_FAILURE,
  AUTH_LOGOUT,
  AUTH_CLEAR_ERROR,
} from "../action-types";

export const authRequest = () => ({
  type: AUTH_REQUEST,
});

export const authSuccess = (user) => ({
  type: AUTH_SUCCESS,
  payload: user,
});

export const authFailure = (error) => ({
  type: AUTH_FAILURE,
  payload: error,
});

export const authLogout = () => ({
  type: AUTH_LOGOUT,
});

export const clearAuthError = () => ({
  type: AUTH_CLEAR_ERROR,
});
