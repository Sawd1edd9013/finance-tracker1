import { PencilIcon, TrashIcon } from "../../components/icon";
import { PageHeader, FilterPanel, Table } from "../../components";
import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";

import { getTransactions, deleteTransaction } from "../../api/transactions";
import { getAccounts } from "../../api/accounts";
import { getCategories } from "../../api/categories";
import { CATEGORY_TYPE_LABELS } from "../../constans/categoryTypeLabels";

export const Transactions = () => {
  const navigate = useNavigate();

  const [transactions, setTransactions] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [accountsMap, setAccountsMap] = useState({});
  const [categoriesMap, setCategoriesMap] = useState({});
  const [error, setError] = useState("");

  const [filters, setFilters] = useState({
    from: "",
    to: "",
    accountId: "",
    categoryId: "",
    type: "",
  });

  const columns = [
    { key: "date", title: "Дата", align: "center" },
    { key: "account", title: "Счёт", align: "center" },
    { key: "category", title: "Категория", align: "center" },
    { key: "type", title: "Тип", align: "center" },
    { key: "amount", title: "Сумма", align: "center" },
    { key: "comment", title: "Комментарий", align: "center" },
    { key: "actions", title: "Действия", align: "center" },
  ];

  useEffect(() => {
    const fetchReferenceData = async () => {
      try {
        setError("");

        const accountsResponse = await getAccounts();
        const categoriesResponse = await getCategories();

        setAccounts(accountsResponse.data);
        setCategories(categoriesResponse.data);

        const nextAccountsMap = {};
        accountsResponse.data.forEach((account) => {
          nextAccountsMap[account.id] = account.name;
        });

        const nextCategoriesMap = {};
        categoriesResponse.data.forEach((category) => {
          nextCategoriesMap[category.id] = category.name;
        });

        setAccountsMap(nextAccountsMap);
        setCategoriesMap(nextCategoriesMap);
      } catch (e) {
        setError(e.message || "Ошибка загрузки данных");
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
    setFilters({
      from: "",
      to: "",
      accountId: "",
      categoryId: "",
      type: "",
    });
  };

  const handleDelete = async (id) => {
    try {
      setError("");

      await deleteTransaction(id);

      const data = await getTransactions(filters);
      setTransactions(data.data);

      const accountsResponse = await getAccounts();
      const nextAccountsMap = {};
      accountsResponse.data.forEach((account) => {
        nextAccountsMap[account.id] = account.name;
      });
      setAccountsMap(nextAccountsMap);
    } catch (e) {
      setError(e.message || "Ошибка удаления операции");
    }
  };

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
    </div>
  );
};
