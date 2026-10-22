import React from "react";
import { Link } from "react-router-dom";

export const NotFound = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-slate-200 px-4 text-center">
      <h1 className="text-6xl font-bold text-slate-800">404</h1>
      <p className="text-xl text-slate-600">Такой страницы не существует</p>
      <Link
        to="/"
        className="rounded-md bg-slate-800 px-6 py-3 text-white hover:bg-slate-700"
      >
        На главную
      </Link>
    </div>
  );
};
