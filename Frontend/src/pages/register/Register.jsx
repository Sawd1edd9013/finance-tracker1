import { Link, useNavigate } from "react-router-dom";
import { FormCard, FormGroup, Input } from "../../components";
import React, { useState, useEffect } from "react";
import {
  selectAuthError,
  selectAuthIsLoading,
  selectCurrentUser,
  selectIsAuthChecked,
} from "../../store/auth/selectors";
import { useDispatch, useSelector } from "react-redux";
import { clearAuthError } from "../../store/auth/actions";
import { registerThunk } from "../../store/auth/thunks";

export const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const user = useSelector(selectCurrentUser);
  const isLoading = useSelector(selectAuthIsLoading);
  const authError = useSelector(selectAuthError);
  const isAuthChecked = useSelector(selectIsAuthChecked);

  const [values, setValues] = useState({
    login: "",
    password: "",
    repeatPassword: "",
  });

  const [localError, setLocalError] = useState("");

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
    setLocalError("");
    if (values.password !== values.repeatPassword) {
      setLocalError("Пароли не совпадают");
      return;
    }
    try {
      await dispatch(
        registerThunk({
          login: values.login,
          password: values.password,
        }),
      );
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

      <FormCard title="Регистрация" className="w-full max-w-md">
        <form onSubmit={handleSubmit} className="space-y-6">
          <FormGroup label="Логин">
            <Input
              type="text"
              placeholder="Введите логин"
              value={values.login}
              onChange={(e) => setField("login", e.target.value)}
              className="h-12 text-lg"
            />
          </FormGroup>

          <FormGroup label="Пароль">
            <Input
              type="password"
              placeholder="Введите пароль"
              value={values.password}
              onChange={(e) => setField("password", e.target.value)}
              className="h-12 text-lg"
            />
          </FormGroup>

          <FormGroup label="Повтор пароля">
            <Input
              type="password"
              placeholder="Повторите пароль"
              value={values.repeatPassword}
              onChange={(e) => setField("repeatPassword", e.target.value)}
              className="h-12 text-lg"
            />
          </FormGroup>

          {localError ? (
            <div className="text-sm text-red-600">{localError}</div>
          ) : null}
          {!localError && authError ? (
            <div className="text-sm text-red-600">{authError}</div>
          ) : null}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full h-12 bg-slate-800 text-white rounded-md hover:bg-slate-700 transition text-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Регистрация..." : "Зарегистрироваться"}
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
