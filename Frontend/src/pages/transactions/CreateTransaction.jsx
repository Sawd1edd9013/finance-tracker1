import React, { useState } from "react";
import { TransactionForm } from "../../components";
import { useNavigate } from "react-router-dom";
import { createTransaction } from "../../api/transactions";

export const CreateTransaction = () => {
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const handleSubmit = async (values) => {
    try {
      setError("");

      console.log("SUBMIT VALUES:", values);
      console.log("DATE VALUE:", values.date);

      if (
        !values.amount ||
        !values.type ||
        !values.accountId ||
        !values.categoryId
      ) {
        setError("Заполните обязательные поля");
        return;
      }

      const amount = Number(values.amount);

      if (isNaN(amount) || amount <= 0) {
        setError("Сумма должна быть положительным числом");
        return;
      }

      await createTransaction({
        amount,
        type: values.type,
        accountId: values.accountId,
        categoryId: values.categoryId,
        comment: values.comment || "",
        date: values.date,
      });

      navigate("/transactions");
    } catch (e) {
      setError(e.message || "Ошибка при создании операции");
    }
  };

  return (
    <div className="px-8 pt-4 pb-8">
      {error && <div className="mb-4 text-red-600 text-sm">{error}</div>}

      <TransactionForm
        mode="create"
        onCancel={() => navigate("/transactions")}
        onSubmit={handleSubmit}
      />
    </div>
  );
};
