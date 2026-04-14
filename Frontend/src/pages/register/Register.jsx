import { Link } from "react-router-dom";
import { FormCard, FormGroup, Input } from "../../components";
import React from "react";

export const Register = () => {
  return (
    <div className="min-h-screen bg-slate-200 flex flex-col items-center justify-center px-4">
      <h1 className="text-5xl font-semibold text-slate-800 mb-16">
        Finance Tracker
      </h1>

      <FormCard title="Регистрация" className="w-full max-w-md">
        <h2 className="text-3xl font-semibold text-center text-slate-800 mb-8"></h2>

        <form className="space-y-6">
          <FormGroup label="Имя пользователя">
            <Input type="text" className="h-12 text-lg" />
          </FormGroup>

          <FormGroup label="Логин">
            <Input type="text" className="h-12 text-lg" />
          </FormGroup>

          <FormGroup label="Пароль">
            <Input type="password" className="h-12 text-lg" />
          </FormGroup>

          <FormGroup label="Повтор пароля">
            <Input type="password" className="h-12 text-lg" />
          </FormGroup>

          <button
            type="submit"
            className="w-full h-12 bg-slate-800 text-white rounded-md hover:bg-slate-700 transition text-xl font-semibold"
          >
            Зарегистрироваться
          </button>
        </form>

        <p className="text-xl text-center text-slate-600 mt-6">
          Уже есть аккаунт?{" "}
          <Link
            to="/login"
            className="text-slate-800 font-medium hover:underline"
          >
            Войти
          </Link>
        </p>
      </FormCard>
    </div>
  );
};
