import React from "react";

export const Panel = ({ title, children, className = "" }) => {
  return (
    <div className={`bg-white rounded-lg shadow-md p-5 ${className}`}>
      {title && (
        <h3 className="mb-3 text-lg font-bold text-slate-900">{title}</h3>
      )}
      {children}
    </div>
  );
};
