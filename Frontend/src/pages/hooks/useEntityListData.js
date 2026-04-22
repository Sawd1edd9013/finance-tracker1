import { useCallback, useEffect, useState } from "react";
import { deleteAccount, getAccounts } from "../../api/accounts";
import { deleteCategory, getCategories } from "../../api/categories";

const PAGE_LIMIT = 10;

export const useAccountsData = () => {
  const [accounts, setAccounts] = useState([]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [pagination, setPagination] = useState({
    page: 1,
    limit: PAGE_LIMIT,
    total: 0,
    pages: 1,
  });

  const fetchAccountsPage = useCallback(async () => {
    try {
      setError("");
      setIsLoading(true);

      const response = await getAccounts({
        page,
        limit: PAGE_LIMIT,
      });

      setAccounts(response.data);
      setPagination(
        response.pagination || {
          page,
          limit: PAGE_LIMIT,
          total: response.data.length,
          pages: 1,
        },
      );
    } catch (e) {
      setError(e.message || "Ошибка загрузки счетов");
    } finally {
      setIsLoading(false);
    }
  }, [page]);

  useEffect(() => {
    fetchAccountsPage();
  }, [fetchAccountsPage]);

  const handleDelete = async (id) => {
    try {
      setError("");
      await deleteAccount(id);
      await fetchAccountsPage();
    } catch (e) {
      setError(e.message || "Ошибка удаления счета");
    }
  };

  return {
    accounts,
    page,
    setPage,
    pagination,
    isLoading,
    error,
    handleDelete,
  };
};

export const useCategoriesData = () => {
  const [categories, setCategories] = useState([]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [pagination, setPagination] = useState({
    page: 1,
    limit: PAGE_LIMIT,
    total: 0,
    pages: 1,
  });

  const fetchCategoriesPage = useCallback(async () => {
    try {
      setError("");
      setIsLoading(true);

      const response = await getCategories({
        page,
        limit: PAGE_LIMIT,
      });

      setCategories(response.data);
      setPagination(
        response.pagination || {
          page,
          limit: PAGE_LIMIT,
          total: response.data.length,
          pages: 1,
        },
      );
    } catch (e) {
      setError(e.message || "Ошибка загрузки категорий");
    } finally {
      setIsLoading(false);
    }
  }, [page]);

  useEffect(() => {
    fetchCategoriesPage();
  }, [fetchCategoriesPage]);

  const handleDelete = async (id) => {
    try {
      setError("");
      await deleteCategory(id);
      await fetchCategoriesPage();
    } catch (e) {
      setError(e.message || "Ошибка удаления категории");
    }
  };

  return {
    categories,
    page,
    setPage,
    pagination,
    error,
    isLoading,
    handleDelete,
  };
};
