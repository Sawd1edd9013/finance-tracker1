import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getTransactions, deleteTransaction } from "../../../api/transactions";
import { getCategories } from "../../../api/categories";
import {
  selectAccounts,
  selectAccountsIsLoading,
  selectAccountsMap,
} from "../../../store/accounts/selectors";
import { fetchAccountsThunk } from "../../../store/accounts/thunks";

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

  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [categoriesMap, setCategoriesMap] = useState({});
  const [error, setError] = useState("");
  const [filters, setFilters] = useState(INITIAL_FILTERS);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    dispatch(fetchAccountsThunk());
  }, [dispatch]);

  useEffect(() => {
    const fetchReferenceData = async () => {
      try {
        setError("");
        setIsLoading(true);

        const categoriesResponse = await getCategories();
        setCategories(categoriesResponse.data);

        const nextCategoriesMap = {};
        categoriesResponse.data.forEach((category) => {
          nextCategoriesMap[category.id] = category.name;
        });

        setCategoriesMap(nextCategoriesMap);
      } catch (e) {
        setError(e.message || "Ошибка загрузки данных");
      } finally {
        setIsLoading(false);
      }
    };

    fetchReferenceData();
  }, []);

  useEffect(() => {
    const fetchTransactionsData = async () => {
      try {
        setError("");

        const data = await getTransactions(filters);
        setTransactions(data.data);
      } catch (e) {
        setError(e.message || "Ошибка загрузки операций");
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

      if (key === "type") {
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
    isLoading: isLoading || accountsLoading,
    filters,
    handleFilterChange,
    handleResetFilters,
    handleDelete,
  };
};
