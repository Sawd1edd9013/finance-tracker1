import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AccountForm } from "../../components";
import { createAccount } from "../../api/accounts";

export const CreateAccount = () => {
  const navigate = useNavigate();
  const [error, setError] = useState("");

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

      await createAccount({
        name: values.name,
        type: values.type,
        balance,
      });

      navigate("/accounts");
    } catch (e) {
      setError(e.message || "Ошибка при создании счета");
    }
  };

  return (
    <div className="px-8 pt-4 pb-8">
      {error && <div className="mb-4 text-red-600 text-sm">{error}</div>}

      <AccountForm
        mode="create"
        onCancel={() => navigate("/accounts")}
        onSubmit={handleSubmit}
      />
    </div>
  );
};
