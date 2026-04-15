import React, { useState, useEffect } from "react";
import { getAccounts, updateAccount } from "../../api/accounts";
import { useNavigate, useParams } from "react-router-dom";
import { AccountForm } from "../../components";

export const EditAccount = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [account, setAccount] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAccount = async () => {
      try {
        setError("");

        const data = await getAccounts();
        const found = data.data.find((acc) => acc.id === id);

        if (!found) {
          setError("Счет не найден");
          return;
        }

        setAccount(found);
      } catch (e) {
        setError(e.message || "Ошибка при загрузке счета");
      }
    };

    fetchAccount();
  }, [id]);

  const handleSubmit = async (values) => {
    try {
      setError("");

      if (!values.name || !values.type) {
        setError("Заполните обязательные поля");
        return;
      }

      const balance = values.balance ? Number(values.balance) : 0;

      if (isNaN(balance)) {
        setError("Баланс должен быть числом");
        return;
      }

      await updateAccount(id, {
        name: values.name,
        type: values.type,
        balance,
      });

      navigate("/accounts");
    } catch (e) {
      setError(e.message || "Ошибка при редактировании счета");
    }
  };

  return (
    <div className="px-8 pt-4 pb-8">
      {error && <div className="mb-4 text-red-600 text-sm">{error}</div>}

      {account && (
        <AccountForm
          mode="edit"
          initialValues={account}
          onCancel={() => navigate("/accounts")}
          onSubmit={handleSubmit}
        />
      )}
    </div>
  );
};
