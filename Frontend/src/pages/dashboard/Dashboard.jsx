import {
  RecentTable,
  MiniList,
  Panel,
  StatCard,
  PeriodSelector,
} from "./components";
import { useNavigate } from "react-router-dom";
import { getTransactions } from "../../api/transactions";
import { getAccounts } from "../../api/accounts";
import { getCategories } from "../../api/categories";
import {
  getAnalytics,
  getTimeAnalytics,
  getCategoryAnalytics,
} from "../../api/analytics";
import { LineChartComponent } from "./components/charts/LineChart";
import { PieChartComponent } from "./components/charts/PieChart";
import React, { useState, useEffect } from "react";

export const Dashboard = () => {
  const [transactions, setTransactions] = useState([]);
  const [accountsMap, setAccountsMap] = useState({});
  const [categoriesMap, setCategoriesMap] = useState({});
  const [analytics, setAnalytics] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [period, setPeriod] = useState({
    from: null,
    to: null,
  });
  const [timeData, setTimeData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [expandedChart, setExpandedChart] = useState(null);
  const navigate = useNavigate();

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
    const fetchData = async () => {
      try {
        const params = {};

        if (period.from) {
          params.from = period.from.toISOString();
          params.to = period.to.toISOString();
        }

        const [
          transactionsRes,
          accRes,
          catRes,
          analyticsRes,
          timeRes,
          categoryRes,
        ] = await Promise.all([
          getTransactions(params),
          getAccounts(),
          getCategories(),
          getAnalytics(params),
          getTimeAnalytics(params),
          getCategoryAnalytics(params),
        ]);

        setTransactions(transactionsRes.data.slice(0, 5));
        setAnalytics(analyticsRes.data);

        const accMap = {};
        accRes.data.forEach((a) => (accMap[a.id] = a.name));
        setAccountsMap(accMap);
        setAccounts(accRes.data);

        const catMap = {};
        catRes.data.forEach((c) => (catMap[c.id] = c.name));

        setCategoriesMap(catMap);
        setCategories(catRes.data);
        setTimeData(timeRes.data);

        const formattedCategoryData = categoryRes.data.map((item) => ({
          name: catMap[item.categoryId] || "Без категории",
          value: item.total,
        }));

        setCategoryData(formattedCategoryData);
      } catch (e) {
        console.error(e);
      }
    };

    fetchData();
  }, [period]);

  const limitedAccounts = [...accounts]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  const limitedCategories = [...categories]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  const closeExpandedChart = () => {
    setExpandedChart(null);
  };

  return (
    <>
      <div className="px-8 pt-4 pb-8">
        <div className="mb-4">
          <PeriodSelector
            onThisMonth={setThisMonth}
            onLastMonth={setLastMonth}
            onCustomPeriod={setCustomPeriod}
          />
        </div>

        <div className="grid grid-cols-4 gap-4 mb-4">
          <StatCard title="Баланс" value={`${analytics?.balance || 0} ₽`} />
          <StatCard title="Доходы" value={`${analytics?.totalIncome || 0} ₽`} />
          <StatCard
            title="Расходы"
            value={`${analytics?.totalExpense || 0} ₽`}
          />
          <StatCard
            title="Чистый результат"
            value={`${analytics?.balance || 0} ₽`}
          />
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <Panel title="Счета">
            <MiniList
              items={limitedAccounts.map((a) => `${a.name} — ${a.balance} ₽`)}
              footerText="Перейти ко всем →"
              onFooterClick={() => navigate("/accounts")}
            />
          </Panel>

          <Panel title="Категории">
            <MiniList
              items={limitedCategories.map(
                (c) =>
                  `${c.name} — ${c.type === "income" ? "Доход" : "Расход"}`,
              )}
              footerText="Перейти ко всем →"
              onFooterClick={() => navigate("/categories")}
            />
          </Panel>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <Panel title="Динамика по дням">
            {timeData.length === 0 ? (
              <div className="text-slate-400 text-base">
                Нет данных за выбранный период
              </div>
            ) : (
              <div
                className="cursor-zoom-in"
                onDoubleClick={() => setExpandedChart("line")}
                title="Двойной клик для увеличения"
              >
                <LineChartComponent data={timeData} />
              </div>
            )}
          </Panel>

          <Panel title="Структура расходов">
            {categoryData.length === 0 ? (
              <div className="text-slate-400 text-base">
                Нет расходов за выбранный период
              </div>
            ) : (
              <div
                className="cursor-zoom-in"
                onDoubleClick={() => setExpandedChart("pie")}
                title="Двойной клик для увеличения"
              >
                <PieChartComponent data={categoryData} />
              </div>
            )}
          </Panel>
        </div>

        <Panel title="Последние операции">
          <RecentTable
            data={transactions}
            accountsMap={accountsMap}
            categoriesMap={categoriesMap}
          />
        </Panel>
      </div>

      {expandedChart ? (
        <div
          className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-6"
          onClick={closeExpandedChart}
        >
          <div
            className="w-[85vw] h-[80vh] bg-white rounded-xl shadow-2xl p-6 flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-slate-900">
                {expandedChart === "line"
                  ? "Динамика по дням"
                  : "Структура расходов"}
              </h3>
              <button
                type="button"
                onClick={closeExpandedChart}
                className="px-4 py-2 text-sm rounded-md border border-slate-300 hover:bg-slate-100"
              >
                Закрыть
              </button>
            </div>

            <div className="flex-1 min-h-0">
              {expandedChart === "line" ? (
                <LineChartComponent data={timeData} height={420} />
              ) : (
                <PieChartComponent
                  data={categoryData}
                  height={520}
                  outerRadius={170}
                />
              )}
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
};
