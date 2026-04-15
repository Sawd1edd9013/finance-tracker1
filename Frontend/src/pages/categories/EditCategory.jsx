import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { CategoryForm } from "../../components";
import { getCategories, updateCategory } from "../../api/categories";

export const EditCategory = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [category, setCategory] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        setError("");

        const data = await getCategories();
        const foundCategory = data.data.find((item) => item.id === id);

        if (!foundCategory) {
          setError("Категория не найдена");
          return;
        }

        setCategory(foundCategory);
      } catch (e) {
        setError(e.message || "Ошибка при загрузке категории");
      }
    };

    fetchCategory();
  }, [id]);

  const handleSubmit = async (values) => {
    try {
      setError("");

      if (!values.name || !values.type) {
        setError("Заполните все поля");
        return;
      }

      await updateCategory(id, {
        name: values.name,
        type: values.type,
      });

      navigate("/categories");
    } catch (e) {
      setError(e.message || "Ошибка при редактировании категории");
    }
  };

  return (
    <div className="px-8 pt-4 pb-8">
      {error && <div className="mb-4 text-red-600 text-sm">{error}</div>}

      {category && (
        <CategoryForm
          mode="edit"
          initialValues={category}
          onCancel={() => navigate("/categories")}
          onSubmit={handleSubmit}
        />
      )}
    </div>
  );
};
