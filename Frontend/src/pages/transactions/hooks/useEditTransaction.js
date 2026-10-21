import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  getTransactionById,
  updateTransaction,
} from "../../../api/transactions";
import { fetchAccountsThunk } from "../../../store/accounts/thunks";

export const useEditTransaction = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();

  const [transaction, setTransaction] = useState(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTransaction = async () => {
      try {
        setError("");
        setIsLoading(true);

        const response = await getTransactionById(id);
        const found = response.data;

        setTransaction({
          ...found,
          amount: String(found.amount ?? ""),
          date: found.date
            ? new Date(found.date).toISOString().slice(0, 10)
            : "",
        });
      } catch (e) {
        setError(e.message || "Ошибка при загрузке операции");
      } finally {
        setIsLoading(false);
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
        date: values.date,
      });

      await dispatch(fetchAccountsThunk({ force: true })).catch(() => null);

      navigate("/transactions");
    } catch (e) {
      setError(e.message || "Ошибка при редактировании операции");
    }
  };

  return {
    transaction,
    error,
    isLoading,
    handleSubmit,
    onCancel: () => navigate("/transactions"),
  };
};
