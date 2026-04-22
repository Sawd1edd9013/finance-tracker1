import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { CategoryForm, Loader } from "../../components";
import {
  selectCategoriesError,
  selectCategoriesIsLoaded,
  selectCategoriesIsLoading,
  selectCategoryById,
} from "../../store/categories/selectors";
import {
  fetchCategoriesThunk,
  updateCategoryThunk,
} from "../../store/categories/thunks";

export const EditCategory = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();

  const category = useSelector((state) => selectCategoryById(state, id));
  const storeError = useSelector(selectCategoriesError);
  const isLoaded = useSelector(selectCategoriesIsLoaded);
  const isLoading = useSelector(selectCategoriesIsLoading);

  const [localError, setLocalError] = useState("");

  useEffect(() => {
    dispatch(fetchCategoriesThunk());
  }, [dispatch]);

  const viewError = useMemo(() => {
    if (localError) {
      return localError;
    }

    if (storeError) {
      return storeError;
    }

    if (!isLoaded || isLoading) {
      return null;
    }

    return category ? null : "Категория не найдена";
  }, [category, isLoaded, isLoading, localError, storeError]);

  const handleSubmit = async (values) => {
    try {
      setLocalError("");

      if (!values.name || !values.type) {
        setLocalError("Заполните все поля");
        return;
      }

      await dispatch(
        updateCategoryThunk(id, {
          name: values.name,
          type: values.type,
        }),
      );

      navigate("/categories");
    } catch (e) {
      setLocalError(e.message || "Ошибка при редактировании категории");
    }
  };

  return (
    <div className="px-8 pt-4 pb-8">
      {viewError && (
        <div className="mb-4 text-red-600 text-sm">{viewError}</div>
      )}

      {isLoading && <Loader />}

      {!isLoading && category && (
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
