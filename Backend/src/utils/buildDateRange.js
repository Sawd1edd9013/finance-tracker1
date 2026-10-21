module.exports = function buildDateRange(from, to) {
  if (!from && !to) {
    return null;
  }

  const range = {};

  if (from) {
    const fromDate = new Date(from);
    fromDate.setUTCHours(0, 0, 0, 0);
    range.$gte = fromDate;
  }

  if (to) {
    const toDate = new Date(to);
    toDate.setUTCHours(23, 59, 59, 999);
    range.$lte = toDate;
  }

  return range;
};
