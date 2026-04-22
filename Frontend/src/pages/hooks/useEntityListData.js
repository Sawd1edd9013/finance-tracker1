import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  selectAccounts,
  selectAccountsError,
  selectAccountsIsLoading,
} from "../../store/accounts/selectors";
import {
  deleteAccountThunk,
  fetchAccountsThunk,
} from "../../store/accounts/thunks";
import {
  selectCategories,
  selectCategoriesError,
  selectCategoriesIsLoading,
} from "../../store/categories/selectors";
import {
  deleteCategoryThunk,
  fetchCategoriesThunk,
} from "../../store/categories/thunks";

export const useAccountsData = () => {
  const dispatch = useDispatch();
  const accounts = useSelector(selectAccounts);
  const isLoading = useSelector(selectAccountsIsLoading);
  const error = useSelector(selectAccountsError);

  useEffect(() => {
    dispatch(fetchAccountsThunk());
  }, [dispatch]);

  const handleDelete = async (id) => {
    await dispatch(deleteAccountThunk(id));
  };

  return {
    accounts,
    isLoading,
    error,
    handleDelete,
  };
};

export const useCategoriesData = () => {
  const dispatch = useDispatch();
  const categories = useSelector(selectCategories);
  const isLoading = useSelector(selectCategoriesIsLoading);
  const error = useSelector(selectCategoriesError);

  useEffect(() => {
    dispatch(fetchCategoriesThunk());
  }, [dispatch]);

  const handleDelete = async (id) => {
    await dispatch(deleteCategoryThunk(id));
  };

  return {
    categories,
    error,
    isLoading,
    handleDelete,
  };
};
