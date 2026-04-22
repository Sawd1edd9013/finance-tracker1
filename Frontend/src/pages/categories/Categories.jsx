import { PencilIcon, TrashIcon } from "../../components/icon";
import { Loader, PageHeader, Table } from "../../components";
import { useNavigate } from "react-router-dom";
import React from "react";
import { CATEGORY_TYPE_LABELS } from "../../constans/categoryTypeLabels";
import { useCategoriesData } from "../hooks/useEntityListData";

export const Categories = () => {
  const {
    categories,
    error,
    isLoading,
    page,
    setPage,
    pagination,
    handleDelete,
  } = useCategoriesData();

  const navigate = useNavigate();

  const columns = [
    { key: "name", title: "Название", align: "left" },
    { key: "type", title: "Тип", align: "left" },
    { key: "actions", title: "Действия", align: "center" },
  ];

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

        {isLoading ? (
          <Loader />
        ) : (
          <>
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

            {pagination.pages > 1 && (
              <div className="mt-6 flex justify-center gap-2">
                {Array.from(
                  { length: pagination.pages },
                  (_, index) => index + 1,
                ).map((pageNumber) => (
                  <button
                    key={pageNumber}
                    onClick={() => setPage(pageNumber)}
                    className={`h-9 min-w-9 px-3 rounded-md border ${
                      page === pageNumber
                        ? "bg-slate-800 text-white border-slate-800"
                        : "bg-white text-slate-800 border-slate-300 hover:bg-slate-100"
                    }`}
                  >
                    {pageNumber}
                  </button>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
