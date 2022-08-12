const httpStatusCodes = require('http-status-codes');
const { Op } = require('sequelize');
const { logger } = require('./../../../common/logger');
const {
  NotFoundError,
  ServerError,
  UnprocessableEntityError,
} = require('./../../../common/errors');

const { sequelize, Locations, Task, TaskPlace, User, Job, ImagesForComments } = require('./../../../models');
const locationService = require('./../../../services/location.service');
const jobService = require('./../../../services/job.service');
const userService = require('./../../../services/user');
const { groupJobsByDate } = require('../../../helpers/response');
const { getPagination } = require('../../../helpers/query');
const { updateJobValidation } = require('../../../middlewares/validation/dataVatilation/updateJobDates');

const awsService = require('./../../../services/aws');

const userJobOptions = {
  include: [
    {
      model: Task,
      as: 'tasks',
      through: { attributes: [] },
    },
    {
      model: Locations,
      as: 'location',
      include: { model: Task, as: 'tasks', through: { attributes: [] } },
    },
    {
      model: ImagesForComments,
      subQuery: true,
      as: 'img',
      attributes: ['id', 'imgUrl' ]
    }
  ],
};

const updateTaskTransaction = async (job, tasks) => {
  const transaction = await sequelize.transaction();
  try {
    await jobService.updateTasks(job, tasks, transaction);
    await transaction.commit();
  } catch (err) {
    logger.error(err);
    await transaction.rollback();
    throw new ServerError({ message: 'Failed to save job tasks' });
  }
}

const getUserJob = async (user, jobId, options) => {
  const searchObj = user.role === User.ROLE_MASTER ? { id: jobId } : { id: jobId, userId: user.id };
  const job = await jobService.findOne(searchObj, options);
  if (!job) {
    throw new NotFoundError({ message: 'User job not found' });
  }

  return job;
};

const findAll = async (req, res) => {
  const { user } = req.state;
  const { limit, offset } = getPagination(req.query, { limit: 100, offset: 0 });

  const includeOptions = [
    { model: Locations, as: 'location' },
    {
      model: Task,
      as: 'tasks',
      subQuery: true,
      include: [
        { model: TaskPlace, as: 'place', attributes: ['id', 'name'] }
      ]
    },
    {
      model: ImagesForComments,
      subQuery: true,
      as: 'img',
      attributes: ['id', 'imgUrl' ]
    }
  ];

  const includeUserOptions = {
    model: User,
    as: 'user',
    attributes: ['id', 'name', 'lastName', 'color' ],
    paranoid: false
  };

  if(user.role === User.ROLE_MASTER) includeOptions.push(includeUserOptions);

  const jobsData = await jobService.findAndCountAllFinished(user, {
    limit,
    offset,
    order: [['endDate', 'DESC']],
    include: includeOptions,
  });

  jobsData.rows = await jobsData.rows.filter((job) => job.tasks.length > 0);
  /**
   * SORT TASKS: Plowed, Salted, Ice Melter Applied
   * */
  await jobsData.rows.map((job) => {
    job.tasks.sort((a, b) => a.id - b.id);
  });

  res.json({
    limit,
    offset,
    total: jobsData.count,
    // data: jobsData.rows,
    dates: groupJobsByDate(jobsData.rows)
  });
};

const findOneActive = async (req, res) => {
  const { user } = req.state;
  let job = await jobService.findAllActive(
    { userId: user.id },
    userJobOptions,
  );

  res.json(job);
};

const findOneByJobId = async (req, res) => {
  const { jobId } = req.params;
  let job = await Job.findAll({
    where: { id: jobId },
    include: userJobOptions.include
  });

  res.json(job);
};

const joinFilesToJob = async (imgIds, jobId) => {
  if(imgIds && imgIds.length > 0){
    // CHECK IMAGE INFO IN DB
    const imgs = await ImagesForComments.findAll({
      where: { id: imgIds.map((id) => id) }, attributes: ['id', 'fileName', 'imgUrl']
    });

    if(imgs.length !== imgIds.length) throw new NotFoundError({ message: 'User not found' });

    // JOIN IMG TO JOB
    await imgIds.map( async (imgId) => {
      await ImagesForComments.update({ jobId }, { where: { id: imgId }});
    });
  }
}

const create = async (req, res) => {
  const { user } = req.state;
  const { locationId } = req.params;
  const { startDate, endDate, tasks = [], comment, imgIds = [] } = req.body;
  const userId = req.body.userId || user.id;

  const location = await locationService.findOne(locationId);
  if (!location) {
    throw new NotFoundError({ message: 'Location not found' });
  }

  const checkUser = await userService.findOne(userId);
  if (!checkUser) {
    throw new NotFoundError({ message: 'User not found' });
  }

  if (!startDate) {
    throw new UnprocessableEntityError({ message: 'Start date is required' });
  }

  /**
   * Job exist validation check exist unique user with location
   * in future should became on unique user only
   * */
  const exists = await jobService.exists({
    userId,
    locationId: location.id
  }, 'active');

  /**
   * Master can create job if, job will be already closed
   * it has endDate param and tasks.
   * If tasks is absent job can not be close.
   * */
  if (exists && user.role !== User.ROLE_MASTER) {
    throw new UnprocessableEntityError({ message: 'Unfinished job exists' });
  }

  let job = await jobService.create({
    startDate,
    endDate,
    userId,
    locationId: location.id,
  });

  const jobId = job.id;

  let jobUser = await getUserJob(user, job.id, userJobOptions);

  // ADD TASK IF IT EXIST
  if(req.body.tasks){
    const taskArr = tasks.map((task) => {
      task.jobId = job.id;
      return task;
    });

    await updateTaskTransaction(jobUser, taskArr);
  }

  // ADD COMMENTS
  if (req.body.comment){
    await Job.update({ comment }, { where: { id: job.id }});
  }

  // JOIN FILES TO JOB
  await joinFilesToJob(imgIds, jobId);

  /**
   * TODO REFACTOR
   * */
  await setTimeout(async () => {
    const jobResult = await jobService.findOne(
      { id: job.id, userId },
      userJobOptions,
    );

    res.json(jobResult);
  }, 0);
};

const destroy = async (req, res) => {
  const { user } = req.state;
  const { jobId } = req.params;
  const job = await getUserJob(user, jobId);
  await jobService.destroy(job.id);
  res.sendStatus(httpStatusCodes.NO_CONTENT);
};

const update = async (req, res) => {
  const { user } = req.state;
  const { jobId } = req.params;
  const { startDate, endDate, tasks = [] } = req.body;
  updateJobValidation(startDate, endDate);
  let job = await getUserJob(user, jobId, userJobOptions);
  await jobService.update(job.id, { startDate, endDate });

  if(req.body.tasks) await updateTaskTransaction(job, tasks);

  job = await getUserJob(user, jobId, userJobOptions);
  res.json(job);
};

const updateTasks = async (req, res) => {
  const { user } = req.state;
  const { jobId } = req.params;
  const { tasks = [] } = req.body;
  let job = await getUserJob(user, jobId, userJobOptions);
  if (!job.endDate) {
    throw new UnprocessableEntityError({ message: 'Job is not stopped' });
  }

  await updateTaskTransaction(job, tasks);
  job = await getUserJob(user, jobId, userJobOptions);

  res.json(job);
};

const addComment = async (req, res) => {
  const { user } = req.state;
  const { jobId } = req.params;
  const { comment } = req.body;
  const job = await getUserJob(user, jobId);
  await Job.update({ comment }, { where: { id: jobId }});
  res.status(200).send({msg: "JOB COMMENTED"});
};

const updateComment = async (req, res) => {
  const { user } = req.state;
  const { jobId } = req.params;
  const { comment } = req.body;
  const job = await getUserJob(user, jobId);
  await Job.update({ comment }, { where: { id: jobId }});
  res.status(200).send({msg: "JOB IS UPDATE"});
};

const uploadToAWSBucket = async (req, res) => {
  const files = req.files;
  const { jobId } = req.params;
  const uploadedInfo = files.map(async (file) => {
    const imgInfo = jobId ? { jobId, fileName: file.key, imgUrl: file.location } : { fileName: file.key, imgUrl: file.location };
    const { id } = await ImagesForComments.create(imgInfo);
    imgInfo.imgId = id;
    return imgInfo;
  });

  const uploadInformation = await Promise.all(uploadedInfo);
  res.status(200).json(uploadInformation);
}

const joinImg = async (req, res) => {
  const { jobId } = req.params;
  const { imgIds } = req.body;

  // CHECK JOB INFO IN DB
  const job = await Job.findOne({ where: { id: jobId }, attributes: ['id']});
  if(!job) return res.status(400).json({ msg: "JOB IS NOT EXIST" });

  // CHECK IMAGE INFO IN DB
  const imgs = await ImagesForComments.findAll({ where: { id: imgIds.map((id) => id) }, attributes: ['id', 'fileName', 'imgUrl']});
  if(imgs.length !== imgIds.length) return res.status(400).json({ msg: "IMG IS NOT EXIST" });

  // JOIN IMG TO JOB
  imgIds.forEach((imgId) => {
    ImagesForComments.update({ jobId }, { where: { id: imgId }});
  });

  res.status(200).json({msg: `IMAGES JOIN TO JOB ${jobId}`});
}

const removeImg = async (req, res) => {
  const { imgId } = req.params;

  // CHECK EXIST IMG
  const img = await ImagesForComments.findOne({ where: { id: imgId }, attributes: ['id', 'fileName', 'imgUrl', 'jobId']});
  if(!img) return res.status(400).json({ msg: "IMG IS NOT EXIST" })

  // DESTROY FORM S3 AND DB
  const { id, fileName, jobId } = img;
  await ImagesForComments.destroy({ where: { id }, force: true});
  await awsService.removeImage(fileName);

  // GET ACTUAL INFO ABOUT IMAGES
  const jobImages = await ImagesForComments.findAll({ where: { jobId }, attributes: ['id', 'fileName', 'imgUrl', 'jobId'] });

  res.status(200).json({
    msg: "IMG REMOVED. IMAGES FOR CURRENT JOB:",
    jobImg: jobImages
  });
}

module.exports = {
  findAll,
  findOneActive,
  findOneByJobId,
  create,
  update,
  destroy,
  updateTasks,
  addComment,
  updateComment,
  uploadToAWSBucket,
  joinImg,
  removeImg
};
