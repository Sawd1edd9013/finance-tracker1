import React, { useState } from "react";

export const DeleteDialog = ({
  title,
  transactionsCount,
  isCountLoading,
  moveTargets,
  moveLabel,
  deleteLabel,
  deleteWarning,
  error,
  isDeleting,
  onConfirm,
  onCancel,
}) => {
  const canMove = Array.isArray(moveTargets);
  const hasMoveTargets = canMove && moveTargets.length > 0;
  const hasTransactions = transactionsCount > 0;

  const [strategy, setStrategy] = useState(hasMoveTargets ? "move" : "delete");
  const [targetId, setTargetId] = useState("");

  const isConfirmDisabled =
    isDeleting ||
    isCountLoading ||
    (hasTransactions && strategy === "move" && !targetId);

  const handleConfirm = () => {
    if (!hasTransactions) {
      onConfirm({});
      return;
    }

    if (strategy === "move") {
      onConfirm({ strategy, targetId });
      return;
    }

    onConfirm({ strategy: "delete" });
  };

  const renderBody = () => {
    if (isCountLoading) {
      return <p className="text-slate-600">Проверяем связанные операции...</p>;
    }

    if (!hasTransactions) {
      return <p className="text-slate-600">Это действие нельзя отменить.</p>;
    }

    return (
      <div className="space-y-4">
        <p className="text-slate-700">
          Связанных операций: <b>{transactionsCount}</b>
        </p>

        {canMove ? (
          <div className="space-y-3">
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-slate-800">
                <input
                  type="radio"
                  name="delete-strategy"
                  checked={strategy === "move"}
                  disabled={!hasMoveTargets}
                  onChange={() => setStrategy("move")}
                />
                {moveLabel}
              </label>

              {hasMoveTargets ? (
                <select
                  value={targetId}
                  disabled={strategy !== "move"}
                  onChange={(e) => setTargetId(e.target.value)}
                  className="h-9 w-full rounded-md border border-slate-300 px-2 disabled:opacity-50"
                >
                  <option value="">Выберите, куда перенести</option>
                  {moveTargets.map((target) => (
                    <option key={target.id} value={target.id}>
                      {target.name}
                    </option>
                  ))}
                </select>
              ) : (
                <p className="text-sm text-slate-500">
                  Нет подходящих записей для переноса
                </p>
              )}
            </div>

            <div className="space-y-1">
              <label className="flex items-center gap-2 text-slate-800">
                <input
                  type="radio"
                  name="delete-strategy"
                  checked={strategy === "delete"}
                  onChange={() => setStrategy("delete")}
                />
                {deleteLabel}
              </label>

              {strategy === "delete" && (
                <p className="text-sm text-red-600">{deleteWarning}</p>
              )}
            </div>
          </div>
        ) : (
          <p className="text-sm text-red-600">{deleteWarning}</p>
        )}
      </div>
    );
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-6"
      onClick={onCancel}
    >
      <div
        className="w-full max-w-md rounded-xl bg-white p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="mb-4 text-xl font-semibold text-slate-900">{title}</h3>

        {renderBody()}

        {error && <div className="mt-4 text-sm text-red-600">{error}</div>}

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={isDeleting}
            className="h-9 rounded-md border border-slate-300 px-4 hover:bg-slate-100 disabled:opacity-50"
          >
            Отмена
          </button>

          <button
            type="button"
            onClick={handleConfirm}
            disabled={isConfirmDisabled}
            className="h-9 rounded-md bg-red-600 px-4 text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isDeleting ? "Удаление..." : "Удалить"}
          </button>
        </div>
      </div>
    </div>
  );
};
