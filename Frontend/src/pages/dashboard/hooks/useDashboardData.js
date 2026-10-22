import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getTransactions } from "../../../api/transactions";
import {
  getAnalytics,
  getTimeAnalytics,
  getCategoryAnalytics,
} from "../../../api/analytics";
import {
  selectAccounts,
  selectAccountsMap,
} from "../../../store/accounts/selectors";
import { fetchAccountsThunk } from "../../../store/accounts/thunks";
import {
  selectCategories,
  selectCategoriesMap,
} from "../../../store/categories/selectors";
import { fetchCategoriesThunk } from "../../../store/categories/thunks";
import { toDateString } from "../../../utils/toDateString";

export const useDashboardData = () => {
  const dispatch = useDispatch();

  const accounts = useSelector(selectAccounts);
  const accountsMap = useSelector(selectAccountsMap);
  const categories = useSelector(selectCategories);
  const categoriesMap = useSelector(selectCategoriesMap);

  const [transactions, setTransactions] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [period, setPeriod] = useState({ from: null, to: null });
  const [timeData, setTimeData] = useState([]);
  const [categoryStats, setCategoryStats] = useState([]);
  const [error, setError] = useState("");

  const setThisMonth = () => {
    const now = new Date();

    setPeriod({
      from: toDateString(new Date(now.getFullYear(), now.getMonth(), 1)),
      to: toDateString(now),
    });
  };

  const setLastMonth = () => {
    const now = new Date();

    setPeriod({
      from: toDateString(new Date(now.getFullYear(), now.getMonth() - 1, 1)),
      to: toDateString(new Date(now.getFullYear(), now.getMonth(), 0)),
    });
  };

  const setCustomPeriod = (from, to) => {
    setPeriod({ from, to });
  };

  useEffect(() => {
    dispatch(fetchAccountsThunk());
    dispatch(fetchCategoriesThunk());
  }, [dispatch]);

  useEffect(() => {
    let isCancelled = false;

    const fetchData = async () => {
      try {
        setError("");
        const params = {};

        if (period.from) {
          params.from = period.from;
          params.to = period.to;
        }

        const [transactionsRes, analyticsRes, timeRes, categoryRes] =
          await Promise.all([
            getTransactions({ ...params, limit: 5 }),
            getAnalytics(params),
            getTimeAnalytics(params),
            getCategoryAnalytics(params),
          ]);

        if (isCancelled) return;

        setTransactions(transactionsRes.data);
        setAnalytics(analyticsRes.data);
        setTimeData(timeRes.data);
        setCategoryStats(categoryRes.data);
      } catch (error) {
        if (isCancelled) return;
        setError(error.message || "Ошибка загрузки данных dashboard");
      }
    };

    fetchData();

    return () => {
      isCancelled = true;
    };
  }, [period]);

  const categoryData = useMemo(
    () =>
      categoryStats.map((item) => ({
        name: categoriesMap[item.categoryId] || "Без категории",
        value: item.total,
      })),
    [categoryStats, categoriesMap],
  );

  const limitedAccounts = useMemo(() => accounts.slice(0, 5), [accounts]);

  const limitedCategories = useMemo(() => categories.slice(0, 5), [categories]);

  const totalBalance = useMemo(
    () =>
      accounts.reduce((sum, account) => sum + Number(account.balance || 0), 0),
    [accounts],
  );

  const netResult =
    Number(analytics?.totalIncome || 0) - Number(analytics?.totalExpense || 0);

  return {
    transactions,
    accounts,
    accountsMap,
    categories,
    categoriesMap,
    analytics,
    period,
    setThisMonth,
    setLastMonth,
    setCustomPeriod,
    timeData,
    categoryData,
    error,
    limitedAccounts,
    limitedCategories,
    totalBalance,
    netResult,
  };
};
