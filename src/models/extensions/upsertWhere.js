module.exports = async function upsertWhere(data, { where, ...options }) {
  const instance = await this.findOne({ where });
  if (instance) {
    return this.update(data, { where, ...options });
  }

  return this.create(data, options);
};
