import React, { useState, useEffect } from "react";
import { TransactionTypeSwitch } from "../form/TransactionTypeSwitch";
import { FormCard } from "../form/FormCard";
import { FormGroup } from "../form/FormGroup";
import { Input } from "../form/Input";

import { getAccounts } from "../../api/accounts";
import { getCategories } from "../../api/categories";

export const TransactionForm = ({
  mode = "create",
  initialValues,
  onSubmit,
  onCancel,
}) => {
  const [values, setValues] = useState({
    type: initialValues?.type ?? "income",
    date: initialValues?.date
      ? new Date(initialValues.date).toISOString().slice(0, 10)
      : "",
    accountId: initialValues?.accountId ?? "",
    categoryId: initialValues?.categoryId ?? "",
    amount: initialValues?.amount ?? "",
    comment: initialValues?.comment ?? "",
  });

  const [accounts, setAccounts] = useState([]);
  const [categories, setCategories] = useState([]);

  const setField = (key, val) => setValues((prev) => ({ ...prev, [key]: val }));

  const title = mode === "edit" ? "Редактирование операции" : "Новая операция";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const aRes = await getAccounts();
        const cRes = await getCategories();

        setAccounts(aRes.data);
        setCategories(cRes.data);
      } catch (e) {
        console.error(e);
      }
    };

    fetchData();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit?.(values);
  };

  return (
    <div className="px-8 pt-4 pb-8">
      <FormCard title={title}>
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <TransactionTypeSwitch
            value={values.type}
            onChange={(t) => setField("type", t)}
          />

          <FormGroup label="Дата">
            <Input
              type="date"
              value={values.date}
              onChange={(e) => setField("date", e.target.value)}
            />
          </FormGroup>

          <FormGroup label="Счёт">
            <select
              value={values.accountId}
              onChange={(e) => setField("accountId", e.target.value)}
              className="h-12 w-full px-4 text-lg rounded-md border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-slate-400 transition"
            >
              <option value="">Выберите счёт</option>
              {accounts.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name}
                </option>
              ))}
            </select>
          </FormGroup>

          <FormGroup label="Категория">
            <select
              value={values.categoryId}
              onChange={(e) => setField("categoryId", e.target.value)}
              className="h-12 w-full px-4 text-lg rounded-md border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-slate-400 transition"
            >
              <option value="">Выберите категорию</option>
              {categories
                .filter((c) => c.type === values.type)
                .map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
            </select>
          </FormGroup>

          <FormGroup label="Сумма">
            <Input
              type="number"
              placeholder="Например: 4500"
              value={values.amount}
              onChange={(e) => setField("amount", e.target.value)}
            />
          </FormGroup>

          <FormGroup label="Комментарий">
            <Input
              type="text"
              placeholder="Например: Пятёрочка"
              value={values.comment}
              onChange={(e) => setField("comment", e.target.value)}
            />
          </FormGroup>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-2 border border-slate-300 rounded-md hover:bg-slate-100"
            >
              Отмена
            </button>

            <button
              type="submit"
              className="px-6 py-2 bg-slate-800 text-white rounded-md hover:bg-slate-700"
            >
              Сохранить
            </button>
          </div>
        </form>
      </FormCard>
    </div>
  );
};
