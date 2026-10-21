import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deleteAccount, getAccounts } from "../../api/accounts";
import { deleteCategory, getCategories } from "../../api/categories";
import { getTransactions } from "../../api/transactions";
import { fetchAccountsThunk } from "../../store/accounts/thunks";
import { fetchCategoriesThunk } from "../../store/categories/thunks";
import { selectCategories } from "../../store/categories/selectors";
import { useDeleteDialog } from "./useDeleteDialog";

const PAGE_LIMIT = 10;

const INITIAL_PAGINATION = {
  page: 1,
  limit: PAGE_LIMIT,
  total: 0,
  pages: 1,
};

const countTransactionsBy = (field) => async (item) => {
  const response = await getTransactions({ [field]: item.id, limit: 1 });
  return response.pagination?.total ?? 0;
};

export const useAccountsData = () => {
  const dispatch = useDispatch();

  const [accounts, setAccounts] = useState([]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [pagination, setPagination] = useState(INITIAL_PAGINATION);

  const fetchAccountsPage = useCallback(async () => {
    try {
      setError("");
      setIsLoading(true);

      const response = await getAccounts({ page, limit: PAGE_LIMIT });

      setAccounts(response.data);
      setPagination(response.pagination);
    } catch (e) {
      setError(e.message || "Ошибка загрузки счетов");
    } finally {
      setIsLoading(false);
    }
  }, [page]);

  useEffect(() => {
    fetchAccountsPage();
  }, [fetchAccountsPage]);

  const deleteDialog = useDeleteDialog({
    countTransactions: countTransactionsBy("accountId"),
    deleteEntity: (account, options) => deleteAccount(account.id, options),
    onDeleted: async () => {
      if (accounts.length === 1 && page > 1) {
        setPage(page - 1);
      } else {
        await fetchAccountsPage();
      }

      await dispatch(fetchAccountsThunk({ force: true })).catch(() => null);
    },
  });

  return {
    accounts,
    page,
    setPage,
    pagination,
    isLoading,
    error,
    deleteDialog,
  };
};

export const useCategoriesData = () => {
  const dispatch = useDispatch();
  const allCategories = useSelector(selectCategories);

  const [categories, setCategories] = useState([]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [pagination, setPagination] = useState(INITIAL_PAGINATION);

  useEffect(() => {
    dispatch(fetchCategoriesThunk()).catch(() => null);
  }, [dispatch]);

  const fetchCategoriesPage = useCallback(async () => {
    try {
      setError("");
      setIsLoading(true);

      const response = await getCategories({ page, limit: PAGE_LIMIT });

      setCategories(response.data);
      setPagination(response.pagination);
    } catch (e) {
      setError(e.message || "Ошибка загрузки категорий");
    } finally {
      setIsLoading(false);
    }
  }, [page]);

  useEffect(() => {
    fetchCategoriesPage();
  }, [fetchCategoriesPage]);

  const deleteDialog = useDeleteDialog({
    countTransactions: countTransactionsBy("categoryId"),
    deleteEntity: (category, options) => deleteCategory(category.id, options),
    onDeleted: async () => {
      if (categories.length === 1 && page > 1) {
        setPage(page - 1);
      } else {
        await fetchCategoriesPage();
      }

      await Promise.all([
        dispatch(fetchCategoriesThunk({ force: true })).catch(() => null),
        dispatch(fetchAccountsThunk({ force: true })).catch(() => null),
      ]);
    },
  });

  return {
    categories,
    allCategories,
    page,
    setPage,
    pagination,
    isLoading,
    error,
    deleteDialog,
  };
};
