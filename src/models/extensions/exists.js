module.exports = async function exists(options) {
  const count = await this.count({ ...options, limit: 1 });
  return count > 0;
};
