const { Locations, User, Task, TaskPlace, Job, Op, ImagesForComments } = require('../../models');

class userInclude {
  constructor() {
    this.include = {
      model: User,
      as: "users",
      through: { attributes: [] },
      attributes: ["id", "name", "lastName", "email", "color", "role"]
    };
  }

  forAll() {
    this.include.where = { active: 'active' }
    return this.include;
  }

  forOne(userId) {
    this.include.where = { id: userId, active: 'active' }
    return this.include;
  }

  forLocationsById = () => {
    this.include.where = { active: 'active' };
    this.include.required = false;
    this.required = false;
    // this.attributes = [ "id", "name", "lastName", "email", "color", "role" ];
    return this.include;
  }
}

/**
 * Locations
 * */
const findOneAndCount = (userId, limit, offset) => {
  const include = new userInclude();

  return Locations.findAndCountAll({
    include: [ include.forOne(userId) ],
    limit,
    offset,
    attributes: ["id"]
  });
}

const findAndCountActiveLocations = (limit, offset) => {
  return Locations.findAndCountAll({
    limit,
    offset,
    attributes: ["id"],
    where: { active: 'active' }
  });
}

const includeTaskPlace = () => {
  return {
    model: TaskPlace,
    as: "place",
    attributes: ["id", "name"]
  }
}

const includeJob = (userId) => {
  return {
    model: Job,
    as: "jobs",
    where: {
      endDate: { [Op.ne]: null },
      userId
    },
    limit: 1,
    order: [["endDate", "DESC"]],
    attributes: ["id", "startDate", "endDate"]
  }
}

class includeJobByUserId {
  constructor(userId) {
    this.include = {
      model: Job,
      as: "jobs",
      where: {
        endDate: { [Op.ne]: null },
        userId
      },
      limit: 1,
      order: [["endDate", "DESC"]],
      attributes: ["id", "startDate", "endDate"]
    }
  }

  required() {
    this.include.required = false
    return this.include;
  }
}

const includeTask = () => {
  return {
    model: Task,
    as: "tasks",
    attributes: ["id", "name", "taskPlaceId"],
    through: { attributes: [] },
    include: [ includeTaskPlace() ]
  }
}

const includeImg = () => {
  return {
    model: ImagesForComments,
    subQuery: true,
    as: 'img',
    attributes: ['id', 'imgUrl' ]
  }
}

const findOne = (locationId) => {
  const include = new userInclude();
  return Locations.findOne({
    where: { id: locationId },
    include: [
      include.include,
      includeImg()
    ]
  });
}

const findAll = (countLocation, userId) => {
  const include = new userInclude();
  return Locations.findAll({
    where: {
      id: countLocation.rows.map(({ id }) => id),
      active: 'active'
    },
    include: [
      include.forAll(),
      includeTask(),
      includeJob(userId),
      includeImg()
    ]
  });
}

/**
 * TODO CHECK includeUser.forLocationsById(). DOES IT NEED?
 * user for location getById and listing
 * */
const getLocationsById = async (userId, countLocation) => {

  const includeJob = new includeJobByUserId(userId);
  const includeUserObj = new userInclude();
  const includeUser = await includeUserObj.forLocationsById();

  const include = [
    includeTask(),
    includeJob.required(),
    includeUser,
    includeImg()
  ];

  return Locations.findAll({
    where: { id: countLocation.map((id) => {
        if(id.id) return id.id;
        return id;
      }) },
    order: [["tasks", "name", "DESC"]],
    include
  });
}


module.exports = {
  findOneAndCount,
  findOne,
  findAll,
  getLocationsById,
  findAndCountActiveLocations,
  includeTask,
  includeJobByUserId
};
