const { Job } = require('../../models');

const closeOpenJobsByUserId = async (id) => {
  const jobOpen = await Job.findAll(
    { where: { userId: id, endDate: null }, attributes: ["id"] });

  return await Job.update(
    { endDate: new Date() },
    { where: { id: jobOpen.map((job) => job.id) } });
}

module.exports = {
  closeOpenJobsByUserId,
};
