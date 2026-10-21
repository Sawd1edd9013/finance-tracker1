import { useState } from "react";

export const useDeleteDialog = ({
  countTransactions,
  deleteEntity,
  onDeleted,
}) => {
  const [target, setTarget] = useState(null);
  const [transactionsCount, setTransactionsCount] = useState(0);
  const [isCountLoading, setIsCountLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState("");

  const open = async (item) => {
    setTarget(item);
    setError("");
    setTransactionsCount(0);
    setIsCountLoading(true);

    try {
      const count = await countTransactions(item);
      setTransactionsCount(count);
    } catch (e) {
      setError(e.message || "Не удалось проверить связанные операции");
    } finally {
      setIsCountLoading(false);
    }
  };

  const close = () => {
    if (isDeleting) return;
    setTarget(null);
  };

  const confirm = async (options) => {
    if (!target) return;

    try {
      setIsDeleting(true);
      setError("");
      await deleteEntity(target, options);
      setTarget(null);
      await onDeleted();
    } catch (e) {
      setError(e.message || "Ошибка удаления");
    } finally {
      setIsDeleting(false);
    }
  };

  return {
    target,
    transactionsCount,
    isCountLoading,
    isDeleting,
    error,
    open,
    close,
    confirm,
  };
};
