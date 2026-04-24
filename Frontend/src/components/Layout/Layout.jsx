import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { UserIcon, OutIcon } from "../icon";
import { useDispatch, useSelector } from "react-redux";
import {
  selectCurrentUser,
  selectIsAuthChecked,
} from "../../store/auth/selectors";
import { fetchCurrentUserThunk, logoutThunk } from "../../store/auth/thunks";
import React, { useEffect, useState } from "react";

export default function Layout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const user = useSelector(selectCurrentUser);
  const isAuthChecked = useSelector(selectIsAuthChecked);
  const [error, setError] = useState("");

  useEffect(() => {
    dispatch(fetchCurrentUserThunk());
  }, [dispatch]);

  useEffect(() => {
    if (isAuthChecked && !user) {
      navigate("/login");
    }
  }, [isAuthChecked, navigate, user]);

  const handleLogout = async () => {
    try {
      setError("");
      await dispatch(logoutThunk());
      navigate("/login");
    } catch (error) {
      setError(error.message || "Ошибка при выходе из аккаунта");
    }
  };

  return (
    <div className="flex min-h-screen">
      <aside className="w-64 bg-gray-200 px-8 py-8 flex flex-col">
        <h1 className="text-2xl font-bold">Finance Tracker</h1>

        <nav className="flex flex-col gap-6 text-xl mt-24">
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive
                ? "bg-gray-300 px-3 py-1 rounded-md font-medium"
                : "px-3 py-1"
            }
          >
            Dashboard
          </NavLink>

          <NavLink
            to="/transactions"
            className={({ isActive }) =>
              isActive
                ? "bg-gray-300 px-3 py-1 rounded-md font-medium"
                : "px-3 py-1"
            }
          >
            История операций
          </NavLink>

          <NavLink
            to="/accounts"
            className={({ isActive }) =>
              isActive
                ? "bg-gray-300 px-3 py-1 rounded-md font-medium"
                : "px-3 py-1"
            }
          >
            Счета
          </NavLink>

          <NavLink
            to="/categories"
            className={({ isActive }) =>
              isActive
                ? "bg-gray-300 px-3 py-1 rounded-md font-medium"
                : "px-3 py-1"
            }
          >
            Категории
          </NavLink>

          <NavLink
            to="/settings"
            className={({ isActive }) =>
              isActive
                ? "bg-gray-300 px-3 py-1 rounded-md font-medium"
                : "px-3 py-1"
            }
          >
            Настройки
          </NavLink>
        </nav>

        <div className="flex flex-col gap-3 text-lg mt-auto mb-10">
          {error ? (
            <div className="mb-4 text-red-600 text-sm">{error}</div>
          ) : null}
          <div className="flex items-center gap-2">
            <UserIcon />
            <span>{user?.login || "..."}</span>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-left"
          >
            <OutIcon />
            <span>Выйти</span>
          </button>
        </div>
      </aside>

      <main className="flex-1 bg-gray-300 p-10">
        <div className="max-w-7xl mx-auto w-full">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
