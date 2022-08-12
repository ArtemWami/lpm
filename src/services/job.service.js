const { Op } = require('sequelize');
const { Job, JobsTasks, Task, Locations, User } = require('../models');

const getId = ({ id }) => id;
const taskStatusIds = [
  JobsTasks.TASK_STATUS_ID_YES,
  JobsTasks.TASK_STATUS_ID_NO,
];

const create = ({ userId, locationId, startDate, endDate }) =>
  Job.create({ userId, locationId, startDate, endDate });

const findOne = (searchObj, { include } = {}) =>
  Job.findOne({ where: searchObj, include });

const findOneActive = ({ userId }, { include } = {}) =>
  Job.scope('active').findOne({
    // where: {userId, '$tasks.task_id$': {[Op.eq]: null}},
    where: {userId},
    include
  });

const findAllActive = ({ userId }, { include } = {}) =>
  Job.scope('active').findAll({
    // where: {userId, '$tasks.task_id$': {[Op.eq]: null}},
    where: {userId},
    include
  });

const update = (jobId, { startDate, endDate }) =>
  Job.update({ startDate, endDate }, { where: { id: jobId } });

const destroy = async (jobId) => {
  const jobTasks = await JobsTasks.findAll({ where: { jobId }, attributes: ['jobId']});
  await JobsTasks.destroy({
    where: {
      jobId: jobTasks.map(({ jobId }) => jobId)
    }
  });

  return Job.destroy({ where: { id: jobId }, force: true });
}

const exists = ({ userId, locationId }, scope = 'defaultScope') =>
  Job.scope(scope).exists({
    where: { userId, locationId },
  });

const findAllByUserId = (userId, { include, limit, offset, order } = {}) =>
  Job.findAll({ where: { userId }, include, limit, offset, order });

const findAndCountAllFinished = async (
  user,
  { include, limit, offset, order } = {},
) => {
  const userId = user.id;
  const filterOptions = { userId, endDate: { [Op.ne]: null } };
  const findOptions = {
    where: user.role === User.ROLE_MASTER ? {endDate: { [Op.ne]: null }} : filterOptions,
    limit,
    offset,
    order,
    attributes: ['id']
  };

  const {rows, count} = await Job.findAndCountAll(findOptions);

  const jobs = await Job.findAll({
    where: {
      id: rows.map(row => row.id),
    },
    include,
    order
  });

  return { count, rows: jobs };
};

const updateTasks = (job, data, transaction) => {
  const locationTaskIds = job.location.tasks.map(getId);
  const jobTasks = data.filter(
    (jobTask) =>
      jobTask.jobId === job.id &&
      locationTaskIds.includes(jobTask.taskId) &&
      taskStatusIds.includes(jobTask.taskStatusId),
  );
  const jobTaskIds = jobTasks.map(getId);
  const { existed, deleted } = job.tasks.reduce(
    (acc, task) => {
      if (jobTaskIds.includes(task.id)) {
        acc.existed.push(task);
      } else {
        acc.deleted.push(task);
      }

      return acc;
    },
    { existed: [], deleted: [] },
  );

  const existedIds = existed.map(getId);
  const { updated, created } = jobTasks.reduce(
    (acc, jobTask) => {
      if (existedIds.includes(jobTask.taskId)) {
        acc.updated.push(jobTask);
      } else {
        acc.created.push(jobTask);
      }

      return acc;
    },
    { updated: [], created: [] },
  );

  return Promise.all([
    JobsTasks.destroy({
      where: { jobId: job.id, taskId: deleted.map(getId) },
      transaction,
    }),
    JobsTasks.bulkCreate(created, { transaction }),
    ...updated.map(({ jobId, taskId, statusId }) =>
      JobsTasks.update(
        { statusId },
        {
          where: { jobId, taskId },
          transaction,
        },
      ),
    ),
  ]);
};

module.exports = {
  create,
  findOne,
  findOneActive,
  findAllActive,
  update,
  destroy,
  exists,
  findAllByUserId,
  findAndCountAllFinished,
  updateTasks,
};
