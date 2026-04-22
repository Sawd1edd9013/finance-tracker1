import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getTransactions, deleteTransaction } from "../../../api/transactions";
import {
  selectAccounts,
  selectAccountsIsLoading,
  selectAccountsMap,
} from "../../../store/accounts/selectors";
import { fetchAccountsThunk } from "../../../store/accounts/thunks";
import {
  selectCategories,
  selectCategoriesIsLoading,
  selectCategoriesMap,
} from "../../../store/categories/selectors";
import { fetchCategoriesThunk } from "../../../store/categories/thunks";

const INITIAL_FILTERS = {
  from: "",
  to: "",
  accountId: "",
  categoryId: "",
  type: "",
};

const PAGE_LIMIT = 10;

export const useTransactionsData = () => {
  const dispatch = useDispatch();

  const accounts = useSelector(selectAccounts);
  const accountsMap = useSelector(selectAccountsMap);
  const accountsLoading = useSelector(selectAccountsIsLoading);

  const categories = useSelector(selectCategories);
  const categoriesMap = useSelector(selectCategoriesMap);
  const categoriesLoading = useSelector(selectCategoriesIsLoading);

  const [transactions, setTransactions] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: PAGE_LIMIT,
    total: 0,
    pages: 1,
  });
  const [page, setPage] = useState(1);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState(INITIAL_FILTERS);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    dispatch(fetchAccountsThunk());
    dispatch(fetchCategoriesThunk());
  }, [dispatch]);

  useEffect(() => {
    const fetchTransactionsData = async () => {
      try {
        setError("");
        setIsLoading(true);

        const data = await getTransactions({
          ...filters,
          page,
          limit: PAGE_LIMIT,
        });

        setTransactions(data.data);
        setPagination(
          data.pagination || {
            page,
            limit: PAGE_LIMIT,
            total: data.data.length,
            pages: 1,
          },
        );
      } catch (e) {
        setError(e.message || "Ошибка загрузки операций");
      } finally {
        setIsLoading(false);
      }
    };

    fetchTransactionsData();
  }, [filters, page]);

  const handleFilterChange = (key, value) => {
    setPage(1);

    setFilters((prev) => {
      const next = {
        ...prev,
        [key]: value,
      };

      if (key === "type" && prev.categoryId) {
        const selectedCategory = categories.find(
          (c) => c.id === prev.categoryId,
        );

        if (selectedCategory && selectedCategory.type !== value) {
          next.categoryId = "";
        }
      }

      return next;
    });
  };

  const handleResetFilters = () => {
    setPage(1);
    setFilters(INITIAL_FILTERS);
  };

  const handleDelete = async (id) => {
    try {
      setError("");

      await deleteTransaction(id);

      const data = await getTransactions({
        ...filters,
        page,
        limit: PAGE_LIMIT,
      });

      setTransactions(data.data);
      setPagination(
        data.pagination || {
          page,
          limit: PAGE_LIMIT,
          total: data.data.length,
          pages: 1,
        },
      );

      await dispatch(fetchAccountsThunk({ force: true }));
    } catch (e) {
      setError(e.message || "Ошибка удаления операции");
    }
  };

  return {
    transactions,
    accounts,
    categories,
    accountsMap,
    categoriesMap,
    error,
    isLoading: isLoading || accountsLoading || categoriesLoading,
    filters,
    page,
    setPage,
    pagination,
    handleFilterChange,
    handleResetFilters,
    handleDelete,
  };
};
