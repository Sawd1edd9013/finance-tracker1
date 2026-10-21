import { Icon } from "./Icon";
import React from "react";

export const ResetIcon = () => {
  return (
    <Icon>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 4.5v6h6" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 19.5v-6h-6" />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M5 10a7 7 0 0112-2M19 14a7 7 0 01-12 2"
      />
    </Icon>
  );
};
