export const formatMoney = (value) =>
  `${Number(value || 0).toLocaleString("ru-RU")} ₽`;
