import React, { useState } from "react";

export const PeriodSelector = ({
  onThisMonth,
  onLastMonth,
  onCustomPeriod,
}) => {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  const handleApply = () => {
    if (!from || !to) return;

    const fromDate = new Date(from);
    const toDate = new Date(to);

    if (fromDate > toDate) return;

    onCustomPeriod(fromDate, toDate);
  };

  return (
    <div className="flex flex-wrap items-center justify-start gap-2 text-lg">
      <span className="text-slate-700 font-medium">Период:</span>

      <button
        onClick={onThisMonth}
        className="h-8 px-3 text-base rounded-md border border-slate-300 bg-white hover:bg-slate-50"
      >
        этот месяц
      </button>

      <button
        onClick={onLastMonth}
        className="h-8 px-3 text-base rounded-md border border-slate-300 bg-white hover:bg-slate-50"
      >
        прошлый месяц
      </button>

      <input
        type="date"
        value={from}
        onChange={(e) => setFrom(e.target.value)}
        className="h-8 px-2 text-sm rounded-md border border-slate-300 bg-white"
      />

      <span className="text-slate-600 text-base">—</span>

      <input
        type="date"
        value={to}
        onChange={(e) => setTo(e.target.value)}
        className="h-8 px-2 text-sm rounded-md border border-slate-300 bg-white"
      />

      <button
        onClick={handleApply}
        disabled={!from || !to}
        className="h-8 px-3 text-base rounded-md border border-slate-300 bg-white hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        выбрать
      </button>
    </div>
  );
};
