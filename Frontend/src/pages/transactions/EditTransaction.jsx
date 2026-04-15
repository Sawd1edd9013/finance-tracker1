import React, { useState, useEffect } from "react";
import { TransactionForm } from "../../components";
import { useNavigate, useParams } from "react-router-dom";
import { getTransactions, updateTransaction } from "../../api/transactions";

export const EditTransaction = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [transaction, setTransaction] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTransaction = async () => {
      try {
        setError("");

        const data = await getTransactions();
        const found = data.data.find((item) => item.id === id);

        if (!found) {
          setError("Операция не найдена");
          return;
        }

        setTransaction({
          ...found,
          amount: String(found.amount ?? ""),
          date: found.createdAt
            ? new Date(found.createdAt).toISOString().slice(0, 10)
            : "",
        });
      } catch (e) {
        setError(e.message || "Ошибка при загрузке операции");
      }
    };

    fetchTransaction();
  }, [id]);

  const handleSubmit = async (values) => {
    try {
      setError("");

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

      await updateTransaction(id, {
        amount,
        type: values.type,
        accountId: values.accountId,
        categoryId: values.categoryId,
        comment: values.comment || "",
      });

      navigate("/transactions");
    } catch (e) {
      setError(e.message || "Ошибка при редактировании операции");
    }
  };

  return (
    <div className="px-8 pt-4 pb-8">
      {error && <div className="mb-4 text-red-600 text-sm">{error}</div>}

      {transaction && (
        <TransactionForm
          mode="edit"
          initialValues={transaction}
          onCancel={() => navigate("/transactions")}
          onSubmit={handleSubmit}
        />
      )}
    </div>
  );
};
