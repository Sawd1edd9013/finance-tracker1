import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  selectAuthError,
  selectAuthIsLoading,
  selectCurrentUser,
  selectIsAuthChecked,
} from "../../../store/auth/selectors";
import { clearAuthError } from "../../../store/auth/actions";
import { loginThunk, registerThunk } from "../../../store/auth/thunks";

export const useAuthForm = ({ mode }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const user = useSelector(selectCurrentUser);
  const isLoading = useSelector(selectAuthIsLoading);
  const authError = useSelector(selectAuthError);
  const isAuthChecked = useSelector(selectIsAuthChecked);

  const initialValues =
    mode === "register"
      ? { login: "", password: "", repeatPassword: "" }
      : { login: "", password: "" };

  const [values, setValues] = useState(initialValues);
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

    try {
      if (mode === "register") {
        if (values.password !== values.repeatPassword) {
          setLocalError("Пароли не совпадают");
          return;
        }

        await dispatch(
          registerThunk({
            login: values.login,
            password: values.password,
          }),
        );
      } else {
        await dispatch(loginThunk(values));
      }
    } catch {
      // Ошибка уже сохраняется в Redux
    }
  };

  return {
    values,
    setField,
    handleSubmit,
    isLoading,
    authError,
    localError,
  };
};
