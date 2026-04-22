import React, { useState } from "react";

export const PeriodSelector = ({
  onThisMonth,
  onLastMonth,
  onCustomPeriod,
}) => {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  const [selectedPeriod, setSelectedPeriod] = useState("");

  const buttonClassName = (periodType) =>
    `h-8 px-3 text-base rounded-md border transition-colors ${
      selectedPeriod === periodType
        ? "border-slate-800 bg-slate-800 text-white"
        : "border-slate-300 bg-white text-slate-800 hover:bg-slate-50"
    }`;

  const handleThisMonth = () => {
    setSelectedPeriod("current");
    onThisMonth();
  };

  const handleLastMonth = () => {
    setSelectedPeriod("previous");
    onLastMonth();
  };

  const handleFromChange = (e) => {
    setSelectedPeriod("custom");
    setFrom(e.target.value);
  };

  const handleToChange = (e) => {
    setSelectedPeriod("custom");
    setTo(e.target.value);
  };

  const handleApply = () => {
    if (!from || !to) return;

    const fromDate = new Date(from);
    const toDate = new Date(to);

    if (fromDate > toDate) return;

    setSelectedPeriod("custom");
    onCustomPeriod(fromDate, toDate);
  };

  return (
    <div className="flex flex-wrap items-center justify-start gap-2 text-lg">
      <span className="text-slate-700 font-medium">Период:</span>

      <button onClick={handleThisMonth} className={buttonClassName("current")}>
        этот месяц
      </button>

      <button onClick={handleLastMonth} className={buttonClassName("previous")}>
        прошлый месяц
      </button>

      <input
        type="date"
        value={from}
        onChange={handleFromChange}
        className="h-8 px-2 text-sm rounded-md border border-slate-300 bg-white"
      />

      <span className="text-slate-600 text-base">—</span>

      <input
        type="date"
        value={to}
        onChange={handleToChange}
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
