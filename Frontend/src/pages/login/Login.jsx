import { Link, useNavigate } from "react-router-dom";
import { FormCard, FormGroup, Input } from "../../components";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  selectAuthError,
  selectAuthIsLoading,
  selectCurrentUser,
  selectIsAuthChecked,
} from "../../store/auth/selectors";
import { clearAuthError } from "../../store/auth/actions";
import { loginThunk } from "../../store/auth/thunks";

export const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const user = useSelector(selectCurrentUser);
  const isLoading = useSelector(selectAuthIsLoading);
  const authError = useSelector(selectAuthError);
  const isAuthChecked = useSelector(selectIsAuthChecked);

  const [values, setValues] = useState({
    login: "",
    password: "",
  });

  useEffect(() => {
    dispatch(clearAuthError());
  }, [dispatch]);

  useEffect(() => {
    if (isAuthChecked && user) {
      navigate("/");
    }
  }, [isAuthChecked, navigate, user]);

  const setField = (key, value) => {
    setValues((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await dispatch(loginThunk(values));
      navigate("/");
    } catch {
      // Ошибка уже сохраняется в Redux
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

          {authError ? (
            <div className="text-sm text-red-600">{authError}</div>
          ) : null}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full h-12 bg-slate-800 text-white rounded-md hover:bg-slate-700 transition text-base font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Вход..." : "Войти"}
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
