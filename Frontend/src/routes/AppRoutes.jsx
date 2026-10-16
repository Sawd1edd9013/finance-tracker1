import { Routes, Route } from "react-router-dom";
import React from "react";
import Layout from "../components/Layout/Layout";
import { RequireAuth } from "../components/require-auth/RequireAuth";
import {
  Dashboard,
  Transactions,
  CreateTransaction,
  EditTransaction,
  Accounts,
  CreateAccount,
  EditAccount,
  Categories,
  CreateCategory,
  EditCategory,
  Settings,
  Login,
  Register,
} from "../pages";

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route element={<RequireAuth />}>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />

          <Route path="transactions" element={<Transactions />} />
          <Route path="transactions/new" element={<CreateTransaction />} />
          <Route path="transactions/:id/edit" element={<EditTransaction />} />

          <Route path="accounts" element={<Accounts />} />
          <Route path="accounts/new" element={<CreateAccount />} />
          <Route path="accounts/:id/edit" element={<EditAccount />} />

          <Route path="categories" element={<Categories />} />
          <Route path="categories/new" element={<CreateCategory />} />
          <Route path="categories/:id/edit" element={<EditCategory />} />

          <Route path="settings" element={<Settings />} />
        </Route>
      </Route>
    </Routes>
  );
};
