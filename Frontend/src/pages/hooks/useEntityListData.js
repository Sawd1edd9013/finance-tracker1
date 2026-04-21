import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getCategories, deleteCategory } from "../../api/categories";
import {
  selectAccounts,
  selectAccountsError,
  selectAccountsIsLoading,
} from "../../store/accounts/selectors";
import {
  deleteAccountThunk,
  fetchAccountsThunk,
} from "../../store/accounts/thunks";

const useListData = ({ loadList, removeItem, withError }) => {
  const [items, setItems] = useState([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const reload = useCallback(async () => {
    const data = await loadList();
    setItems(data.data);
  }, [loadList]);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        setIsLoading(true);
        await reload();
      } catch (e) {
        if (withError) {
          setError(e.message);
        } else {
          console.error(e);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchItems();
  }, [reload, withError]);

  const handleDelete = async (id) => {
    try {
      if (withError) {
        setError("");
      }

      await removeItem(id);
      await reload();
    } catch (e) {
      if (withError) {
        setError(e.message);
      } else {
        console.error(e);
      }
    }
  };

  return {
    items,
    error,
    isLoading,
    handleDelete,
  };
};

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
  const { items, error, isLoading, handleDelete } = useListData({
    loadList: getCategories,
    removeItem: deleteCategory,
    withError: true,
  });

  return {
    categories: items,
    error,
    isLoading,
    handleDelete,
  };
};
