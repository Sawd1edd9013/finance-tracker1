import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getTransactions } from "../../../api/transactions";
import { getCategories } from "../../../api/categories";
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

export const useDashboardData = () => {
  const dispatch = useDispatch();
  const accounts = useSelector(selectAccounts);
  const accountsMap = useSelector(selectAccountsMap);

  const [transactions, setTransactions] = useState([]);
  const [categoriesMap, setCategoriesMap] = useState({});
  const [analytics, setAnalytics] = useState(null);
  const [categories, setCategories] = useState([]);
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
  }, [dispatch]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const params = {};

        if (period.from) {
          params.from = period.from.toISOString();
          params.to = period.to.toISOString();
        }

        const [transactionsRes, catRes, analyticsRes, timeRes, categoryRes] =
          await Promise.all([
            getTransactions(params),
            getCategories(),
            getAnalytics(params),
            getTimeAnalytics(params),
            getCategoryAnalytics(params),
          ]);

        setTransactions(transactionsRes.data.slice(0, 5));
        setAnalytics(analyticsRes.data);

        const catMap = {};
        catRes.data.forEach((c) => {
          catMap[c.id] = c.name;
        });

        setCategoriesMap(catMap);
        setCategories(catRes.data);
        setTimeData(timeRes.data);

        const formattedCategoryData = categoryRes.data.map((item) => ({
          name: catMap[item.categoryId] || "Без категории",
          value: item.total,
        }));

        setCategoryData(formattedCategoryData);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [period]);

  const limitedAccounts = useMemo(() => {
    return accounts.slice(0, 5);
  }, [accounts]);

  const limitedCategories = useMemo(() => {
    return categories.slice(0, 5);
  }, [categories]);

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
  };
};
