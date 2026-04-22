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

export const useTransactionsData = () => {
  const dispatch = useDispatch();

  const accounts = useSelector(selectAccounts);
  const accountsMap = useSelector(selectAccountsMap);
  const accountsLoading = useSelector(selectAccountsIsLoading);

  const categories = useSelector(selectCategories);
  const categoriesMap = useSelector(selectCategoriesMap);
  const categoriesLoading = useSelector(selectCategoriesIsLoading);

  const [transactions, setTransactions] = useState([]);
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

        const data = await getTransactions(filters);
        setTransactions(data.data);
      } catch (e) {
        setError(e.message || "Ошибка загрузки операций");
      } finally {
        setIsLoading(false);
      }
    };

    fetchTransactionsData();
  }, [filters]);

  const handleFilterChange = (key, value) => {
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
    setFilters(INITIAL_FILTERS);
  };

  const handleDelete = async (id) => {
    try {
      setError("");

      await deleteTransaction(id);

      const data = await getTransactions(filters);
      setTransactions(data.data);

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
    handleFilterChange,
    handleResetFilters,
    handleDelete,
  };
};
