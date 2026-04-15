import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CategoryForm } from "../../components";
import { createCategory } from "../../api/categories";

export const CreateCategory = () => {
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const handleSubmit = async (values) => {
    try {
      setError("");
      if (!values.name || !values.type) {
        setError("Заполните все поля");
        return;
      }

      await createCategory({
        name: values.name,
        type: values.type,
      });

      navigate("/categories");
    } catch (e) {
      setError(e.message || "Ошибка при создании категории");
    }
  };

  return (
    <div className="px-8 pt-4 pb-8">
      {error && <div className="mb-4 text-red-600 text-sm">{error}</div>}

      <CategoryForm
        mode="create"
        onCancel={() => navigate("/categories")}
        onSubmit={handleSubmit}
      />
    </div>
  );
};
