import { PencilIcon, TrashIcon } from "../../components/icon";
import { Loader, PageHeader, FilterPanel, Table } from "../../components";
import { useNavigate } from "react-router-dom";
import { CATEGORY_TYPE_LABELS } from "../../constans/categoryTypeLabels";
import { useTransactionsData } from "./hooks/useTransactionsData";
import React from "react";

export const Transactions = () => {
  const navigate = useNavigate();

  const {
    transactions,
    accounts,
    categories,
    accountsMap,
    categoriesMap,
    error,
    isLoading,
    filters,
    page,
    setPage,
    pagination,
    handleFilterChange,
    handleResetFilters,
    handleDelete,
  } = useTransactionsData();

  const columns = [
    { key: "date", title: "Дата", align: "center" },
    { key: "account", title: "Счёт", align: "center" },
    { key: "category", title: "Категория", align: "center" },
    { key: "type", title: "Тип", align: "center" },
    { key: "amount", title: "Сумма", align: "center" },
    { key: "comment", title: "Комментарий", align: "center" },
    { key: "actions", title: "Действия", align: "center" },
  ];

  return (
    <div className="px-8 pt-4 pb-8">
      <PageHeader title="История операций" />

      <FilterPanel
        filters={filters}
        onChange={handleFilterChange}
        onReset={handleResetFilters}
        accounts={accounts}
        categories={categories}
      >
        <button
          onClick={() => navigate("/transactions/new")}
          className="self-end h-9 px-5 bg-gray-700 text-white rounded-md text-base hover:bg-slate-600"
        >
          + Добавить операцию
        </button>
      </FilterPanel>

      {error && <div className="mb-4 text-red-600 text-sm">{error}</div>}

      {isLoading ? (
        <Loader />
      ) : (
        <>
          <Table
            columns={columns}
            data={transactions}
            rowKey={(row) => row.id}
            renderCell={(col, row) => {
              if (col.key === "date") {
                return new Date(row.date).toLocaleDateString();
              }

              if (col.key === "account") {
                return accountsMap[row.accountId] || "—";
              }

              if (col.key === "category") {
                return categoriesMap[row.categoryId] || "—";
              }

              if (col.key === "type") {
                return CATEGORY_TYPE_LABELS[row.type] || row.type;
              }

              if (col.key === "amount") {
                return `${row.amount} ₽`;
              }

              if (col.key !== "actions") return row[col.key];

              return (
                <div className="flex justify-center gap-3">
                  <button
                    onClick={() => navigate(`/transactions/${row.id}/edit`)}
                    className="text-slate-900 hover:text-slate-800"
                  >
                    <PencilIcon />
                  </button>

                  <button
                    onClick={() => handleDelete(row.id)}
                    className="text-slate-900 hover:text-red-600"
                  >
                    <TrashIcon />
                  </button>
                </div>
              );
            }}
          />

          {pagination.pages > 1 && (
            <div className="mt-6 flex justify-center gap-2">
              {Array.from(
                { length: pagination.pages },
                (_, index) => index + 1,
              ).map((pageNumber) => (
                <button
                  key={pageNumber}
                  onClick={() => setPage(pageNumber)}
                  className={`h-9 min-w-9 px-3 rounded-md border ${
                    page === pageNumber
                      ? "bg-slate-800 text-white border-slate-800"
                      : "bg-white text-slate-800 border-slate-300 hover:bg-slate-100"
                  }`}
                >
                  {pageNumber}
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};
