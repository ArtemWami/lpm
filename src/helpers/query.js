const MAX_SAFE_LIMIT = 1000;

const getInRange = (value, min, max) => Math.max(min, Math.min(max, Number(value)));

const getPagination = (page, defaultValues = { limit: 10, offset: 0 }) => {
  const limit = page.limit || defaultValues.limit;
  const offset = page.offset || defaultValues.offset;
  return {
    limit: getInRange(limit, 0, MAX_SAFE_LIMIT),
    offset: getInRange(offset, 0, Number.MAX_SAFE_INTEGER),
  };
};
module.exports = {
  getPagination,
};
