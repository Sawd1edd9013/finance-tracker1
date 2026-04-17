import { PageHeader, FormCard, FormGroup, Input } from "../../components";
import { getUserName, updateUserSettings } from "../../api/auth";
import React, { useEffect, useState } from "react";

export const Settings = () => {
  const [values, setValues] = useState({
    login: "",
    password: "",
    repeatPassword: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await getUserName();
        setValues((prev) => ({
          ...prev,
          login: res.data.login || "",
        }));
      } catch (e) {
        setError(e.message);
      }
    };

    fetchUser();
  }, []);

  const setField = (key, value) => {
    setValues((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (values.password && values.password !== values.repeatPassword) {
      setError("Пароли не совпадают");
      return;
    }

    try {
      setIsSaving(true);

      await updateUserSettings({
        login: values.login.trim(),
        password: values.password,
      });

      setValues((prev) => ({
        ...prev,
        password: "",
        repeatPassword: "",
      }));
      setSuccess("Настройки успешно сохранены");
    } catch (e) {
      setError(e.message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="px-8 pt-4 pb-8">
      <PageHeader title="Настройки" />

      <FormCard title="Данные пользователя">
        <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
          <FormGroup label="Login">
            <Input
              type="text"
              placeholder="Введите login"
              value={values.login}
              onChange={(e) => setField("login", e.target.value)}
            />
          </FormGroup>

          <FormGroup label="Новый пароль">
            <Input
              type="password"
              placeholder="Введите новый пароль"
              value={values.password}
              onChange={(e) => setField("password", e.target.value)}
            />
          </FormGroup>

          <FormGroup label="Повторите пароль">
            <Input
              type="password"
              placeholder="Повторите новый пароль"
              value={values.repeatPassword}
              onChange={(e) => setField("repeatPassword", e.target.value)}
            />
          </FormGroup>

          {error ? <div className="text-sm text-red-600">{error}</div> : null}
          {success ? (
            <div className="text-sm text-green-700">{success}</div>
          ) : null}

          <div className="flex justify-center mt-2">
            <button
              type="submit"
              disabled={isSaving}
              className="px-6 py-2 border border-slate-300 rounded-md hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaving ? "Сохранение..." : "Сохранить"}
            </button>
          </div>
        </form>
      </FormCard>
    </div>
  );
};
