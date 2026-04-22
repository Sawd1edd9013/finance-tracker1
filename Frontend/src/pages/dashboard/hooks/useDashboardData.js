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
  const [categoryData, setCategoryData] = useState([]);

  const setThisMonth = () => {
    const now = new Date();
    const from = new Date(now.getFullYear(), now.getMonth(), 1);
    const to = new Date();
    setPeriod({ from, to });
  };

  const setLastMonth = () => {
    const now = new Date();
    const from = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const to = new Date(now.getFullYear(), now.getMonth(), 0);
    setPeriod({ from, to });
  };

  const setCustomPeriod = (from, to) => {
    setPeriod({ from, to });
  };

  useEffect(() => {
    dispatch(fetchAccountsThunk());
    dispatch(fetchCategoriesThunk());
  }, [dispatch]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const params = {};

        if (period.from) {
          params.from = period.from.toISOString();
          params.to = period.to.toISOString();
        }

        const [transactionsRes, analyticsRes, timeRes, categoryRes] =
          await Promise.all([
            getTransactions(params),
            getAnalytics(params),
            getTimeAnalytics(params),
            getCategoryAnalytics(params),
          ]);

        setTransactions(transactionsRes.data.slice(0, 5));
        setAnalytics(analyticsRes.data);
        setTimeData(timeRes.data);

        const formattedCategoryData = categoryRes.data.map((item) => ({
          name: categoriesMap[item.categoryId] || "Без категории",
          value: item.total,
        }));

        setCategoryData(formattedCategoryData);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [categoriesMap, period]);

  const limitedAccounts = useMemo(
    () =>
      [...accounts]
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5),
    [accounts],
  );

  const limitedCategories = useMemo(
    () =>
      [...categories]
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5),
    [categories],
  );

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
    limitedAccounts,
    limitedCategories,
    totalBalance,
    netResult,
  };
};
