import React from "react";
import { Table } from "../../../components";
import { useNavigate } from "react-router-dom";
import { CATEGORY_TYPE_LABELS } from "../../../constants/categoryTypeLabels";

export const RecentTable = ({
  data = [],
  accountsMap = {},
  categoriesMap = {},
}) => {
  const navigate = useNavigate();

  const columns = [
    { key: "date", title: "Дата", align: "left" },
    { key: "account", title: "Счёт", align: "left" },
    { key: "category", title: "Категория", align: "left" },
    { key: "type", title: "Тип", align: "left" },
    { key: "amount", title: "Сумма", align: "right" },
  ];

  return (
    <div>
      <Table
        columns={columns}
        data={data}
        rowKey={(row) => row.id}
        renderCell={(col, row) => {
          if (col.key === "date") {
            return new Date(row.date || row.createdAt).toLocaleDateString(
              "ru-RU",
              { timeZone: "UTC" },
            );
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

          return row[col.key];
        }}
      />

      <div className="mt-3 text-right">
        <button
          onClick={() => navigate("/transactions")}
          className="text-sm text-slate-600 hover:text-slate-900 hover:underline"
        >
          Перейти к истории →
        </button>
      </div>
    </div>
  );
};
