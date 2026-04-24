import {
  RecentTable,
  MiniList,
  Panel,
  StatCard,
  PeriodSelector,
} from "./components";
import { useNavigate } from "react-router-dom";

import { LineChartComponent } from "./components/charts/LineChart";
import { PieChartComponent } from "./components/charts/PieChart";
import React, { useState } from "react";
import { useDashboardData } from "./hooks/useDashboardData";

export const Dashboard = () => {
  const [expandedChart, setExpandedChart] = useState(null);
  const navigate = useNavigate();

  const {
    transactions,
    accountsMap,
    categoriesMap,
    analytics,
    timeData,
    categoryData,
    error,
    limitedAccounts,
    limitedCategories,
    totalBalance,
    netResult,
    setThisMonth,
    setLastMonth,
    setCustomPeriod,
  } = useDashboardData();

  const closeExpandedChart = () => {
    setExpandedChart(null);
  };

  return (
    <>
      <div className="px-8 pt-4 pb-8">
        {error ? (
          <div className="mb-4 text-red-600 text-sm">{error}</div>
        ) : null}
        <div className="mb-4">
          <PeriodSelector
            onThisMonth={setThisMonth}
            onLastMonth={setLastMonth}
            onCustomPeriod={setCustomPeriod}
          />
        </div>

        <div className="grid grid-cols-4 gap-4 mb-4">
          <StatCard title="Баланс" value={`${totalBalance} ₽`} />
          <StatCard title="Доходы" value={`${analytics?.totalIncome || 0} ₽`} />
          <StatCard
            title="Расходы"
            value={`${analytics?.totalExpense || 0} ₽`}
          />
          <StatCard title="Чистый результат" value={`${netResult} ₽`} />
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
