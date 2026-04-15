import React from "react";

export const FilterPanel = ({
  filters,
  onChange,
  onReset,
  accounts = [],
  categories = [],
  children,
}) => {
  return (
    <div className="bg-white rounded-lg p-6 shadow-md mb-6">
      <div className="flex flex-wrap items-end gap-4 justify-between">
        <div className="flex flex-wrap items-end gap-4">
          <div>
            <label className="block text-sm mb-1">Период</label>
            <div className="flex gap-2">
              <input
                type="date"
                value={filters.from}
                onChange={(e) => onChange("from", e.target.value)}
                className="h-9 px-3 border rounded-md"
              />
              <input
                type="date"
                value={filters.to}
                onChange={(e) => onChange("to", e.target.value)}
                className="h-9 px-3 border rounded-md"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm mb-1">Счёт</label>
            <select
              value={filters.accountId}
              onChange={(e) => onChange("accountId", e.target.value)}
              className="h-9 px-3 border rounded-md"
            >
              <option value="">Все</option>
              {accounts.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm mb-1">Категория</label>
            <select
              value={filters.categoryId}
              onChange={(e) => onChange("categoryId", e.target.value)}
              className="h-9 px-3 border rounded-md"
            >
              <option value="">Все</option>
              {categories
                .filter((c) => {
                  if (!filters.type) return true;
                  return c.type === filters.type;
                })
                .map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
            </select>
          </div>

          <div>
            <label className="block text-sm mb-1">Тип</label>
            <select
              value={filters.type}
              onChange={(e) => onChange("type", e.target.value)}
              className="h-9 px-3 border rounded-md"
            >
              <option value="">Все</option>
              <option value="income">Доход</option>
              <option value="expense">Расход</option>
            </select>
          </div>

          <button
            onClick={onReset}
            className="h-9 px-4 border rounded-md hover:bg-gray-100"
          >
            Сбросить
          </button>
        </div>

        {children}
      </div>
    </div>
  );
};
