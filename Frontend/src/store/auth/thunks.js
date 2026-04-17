import {
  loginUser,
  registerUser,
  getUserName,
  logoutUser,
} from "../../api/auth";
import { authFailure, authLogout, authRequest, authSuccess } from "./actions";

export const fetchCurrentUserThunk = () => async (dispatch) => {
  dispatch(authRequest());

  try {
    const response = await getUserName();
    dispatch(authSuccess(response.data));
    return response.data;
  } catch (error) {
    dispatch(authFailure(error.message));
    return null;
  }
};

export const loginThunk = (credentials) => async (dispatch) => {
  dispatch(authRequest());

  try {
    await loginUser(credentials);
    const response = await getUserName();
    dispatch(authSuccess(response.data));
    return response.data;
  } catch (error) {
    dispatch(authFailure(error.message));
    throw error;
  }
};

export const registerThunk = (payload) => async (dispatch) => {
  dispatch(authRequest());

  try {
    await registerUser(payload);
    const response = await getUserName();
    dispatch(authSuccess(response.data));
    return response.data;
  } catch (error) {
    dispatch(authFailure(error.message));
    throw error;
  }
};

export const logoutThunk = () => async (dispatch) => {
  try {
    await logoutUser();
    dispatch(authLogout());
  } catch (error) {
    dispatch(authFailure(error.message));
    throw error;
  }
};
