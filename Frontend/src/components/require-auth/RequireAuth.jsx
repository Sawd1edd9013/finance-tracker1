import React, { useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  selectCurrentUser,
  selectIsAuthChecked,
} from "../../store/auth/selectors";
import { fetchCurrentUserThunk } from "../../store/auth/thunks";
import { Loader } from "../loader/Loader";

export const RequireAuth = () => {
  const dispatch = useDispatch();
  const user = useSelector(selectCurrentUser);
  const isAuthChecked = useSelector(selectIsAuthChecked);

  useEffect(() => {
    if (!isAuthChecked) {
      dispatch(fetchCurrentUserThunk());
    }
  }, [dispatch, isAuthChecked]);

  if (!isAuthChecked) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader text="Проверка авторизации..." />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};
