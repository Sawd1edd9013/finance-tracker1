import {
  createAccount,
  deleteAccount,
  getAccounts,
  updateAccount,
} from "../../api/accounts";
import { accountsFailure, accountsRequest, accountsSuccess } from "./actions";

export const fetchAccountsThunk =
  ({ force = false } = {}) =>
  async (dispatch, getState) => {
    const { accounts } = getState();

    if (!force && accounts.isLoaded) {
      return accounts.items;
    }

    dispatch(accountsRequest());

    try {
      const response = await getAccounts();
      dispatch(accountsSuccess(response.data));
      return response.data;
    } catch (error) {
      dispatch(accountsFailure(error.message));
      throw error;
    }
  };

export const createAccountThunk = (payload) => async (dispatch) => {
  try {
    await createAccount(payload);
    await dispatch(fetchAccountsThunk({ force: true }));
  } catch (error) {
    dispatch(accountsFailure(error.message));
    throw error;
  }
};

export const updateAccountThunk = (id, payload) => async (dispatch) => {
  try {
    await updateAccount(id, payload);
    await dispatch(fetchAccountsThunk({ force: true }));
  } catch (error) {
    dispatch(accountsFailure(error.message));
    throw error;
  }
};

export const deleteAccountThunk = (id) => async (dispatch) => {
  try {
    await deleteAccount(id);
    await dispatch(fetchAccountsThunk({ force: true }));
  } catch (error) {
    dispatch(accountsFailure(error.message));
    throw error;
  }
};
