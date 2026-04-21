import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AccountForm, Loader } from "../../components";
import {
  selectAccountById,
  selectAccountsError,
  selectAccountsIsLoaded,
  selectAccountsIsLoading,
} from "../../store/accounts/selectors";
import {
  fetchAccountsThunk,
  updateAccountThunk,
} from "../../store/accounts/thunks";
import React, { useEffect, useMemo, useState } from "react";

export const EditAccount = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();

  const account = useSelector((state) => selectAccountById(state, id));
  const storeError = useSelector(selectAccountsError);
  const isLoaded = useSelector(selectAccountsIsLoaded);
  const isLoading = useSelector(selectAccountsIsLoading);

  const [localError, setLocalError] = useState("");

  useEffect(() => {
    dispatch(fetchAccountsThunk());
  }, [dispatch]);

  const viewError = useMemo(() => {
    if (localError) return localError;
    if (storeError) return storeError;
    if (!isLoaded || isLoading) return null;
    return account ? null : "Счет не найден";
  }, [account, isLoaded, isLoading, localError, storeError]);

  const handleSubmit = async (values) => {
    try {
      setLocalError("");

      if (!values.name || !values.type) {
        setLocalError("Заполните обязательные поля");
        return;
      }

      const balance = values.balance ? Number(values.balance) : 0;

      if (isNaN(balance)) {
        setLocalError("Баланс должен быть числом");
        return;
      }

      await dispatch(
        updateAccountThunk(id, {
          name: values.name,
          type: values.type,
          balance,
        }),
      );

      navigate("/accounts");
    } catch (e) {
      setLocalError(e.message || "Ошибка при редактировании счета");
    }
  };

  return (
    <div className="px-8 pt-4 pb-8">
      {viewError && (
        <div className="mb-4 text-red-600 text-sm">{viewError}</div>
      )}

      {isLoading && <Loader />}

      {!isLoading && account && (
        <AccountForm
          mode="edit"
          initialValues={account}
          onCancel={() => navigate("/accounts")}
          onSubmit={handleSubmit}
        />
      )}
    </div>
  );
};
