import { PencilIcon, TrashIcon } from "../../components/icon";
import { PageHeader, Table } from "../../components";
import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { deleteCategory, getCategories } from "../../api/categories";
import { CATEGORY_TYPE_LABELS } from "../../constans/categoryTypeLabels";

export const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const columns = [
    { key: "name", title: "Название", align: "left" },
    { key: "type", title: "Тип", align: "left" },
    { key: "actions", title: "Действия", align: "center" },
  ];

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategories();
        setCategories(data.data);
      } catch (e) {
        console.error(e);
      }
    };

    fetchCategories();
  }, []);

  const handleDelete = async (id) => {
    try {
      setError("");

      await deleteCategory(id);

      const data = await getCategories();
      setCategories(data.data);
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <div className="px-8 pt-4 pb-8">
      <PageHeader title="Категории" />
      <div className="bg-white rounded-lg p-6 shadow-md">
        <div className="flex justify-end mb-6">
          <button
            onClick={() => navigate("/categories/new")}
            className="h-9 px-4 border border-slate-300 rounded-md text-base hover:bg-slate-100"
          >
            + Добавить категорию
          </button>
        </div>
        {error && <div className="mb-4 text-red-600 text-sm">{error}</div>}
        <Table
          columns={columns}
          data={categories}
          rowKey={(row) => row.id}
          renderCell={(col, row) => {
            if (col.key === "type") {
              return CATEGORY_TYPE_LABELS[row.type] || row.type;
            }

            if (col.key !== "actions") return row[col.key];

            return (
              <div className="flex justify-center gap-3">
                <button
                  onClick={() => navigate(`/categories/${row.id}/edit`)}
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
    </div>
  );
};
