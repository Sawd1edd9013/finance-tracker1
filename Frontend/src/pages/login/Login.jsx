import { Link, useNavigate } from "react-router-dom";
import { FormCard, FormGroup, Input } from "../../components";
import { loginUser } from "../../api/auth";
import React, { useState } from "react";

export const Login = () => {
  const navigate = useNavigate();

  const [values, setValues] = useState({
    login: "",
    password: "",
  });

  const [error, setError] = useState("");

  const setField = (key, value) => {
    setValues((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await loginUser(values);
      navigate("/");
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <div className="min-h-screen bg-slate-200 flex flex-col items-center justify-center px-4">
      <h1 className="text-5xl font-semibold text-slate-800 mb-16">
        Finance Tracker
      </h1>

      <FormCard title="Вход" className="w-full max-w-md">
        <form onSubmit={handleSubmit} className="space-y-6">
          <FormGroup label="Логин">
            <Input
              type="text"
              placeholder="Введите логин"
              className="h-12 text-xl"
              value={values.login}
              onChange={(e) => setField("login", e.target.value)}
            />
          </FormGroup>

          <FormGroup label="Пароль">
            <Input
              type="password"
              placeholder="••••••••"
              className="h-12 text-xl"
              value={values.password}
              onChange={(e) => setField("password", e.target.value)}
            />
          </FormGroup>

          {error ? <div className="text-sm text-red-600">{error}</div> : null}

          <button
            type="submit"
            className="w-full h-12 bg-slate-800 text-white rounded-md hover:bg-slate-700 transition text-base font-semibold"
          >
            Войти
          </button>
        </form>

        <p className="text-xl text-center text-slate-600 mt-6">
          Нет аккаунта?{" "}
          <Link
            to="/register"
            className="text-slate-800 font-medium hover:underline"
          >
            Зарегистрироваться
          </Link>
        </p>
      </FormCard>
    </div>
  );
};
