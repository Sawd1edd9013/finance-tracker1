import { Icon } from "./Icon";
import React from "react";

export const ClockIcon = () => {
  return (
    <Icon>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2" />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 21a9 9 0 100-18 9 9 0 000 18z"
      />
    </Icon>
  );
};
