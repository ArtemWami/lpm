const {
  Locations,
  User,
  Task,
  TaskPlace,
  Job,
  UserLocations,
  LocationsTasks,
  Op,
  JobsTasks,
  TaskStatus
} = require("./../../../models");
const { getPagination } = require("../../../helpers/query");
const csv = require("csv");
const locationService = require("../../../services/location");
const userService = require("../../../services/user");
// const { flatten } = require('../src/helpers/array');
const { flatten } = require('../../../helpers/array');

module.exports = {
  /**
   * Get location information for the current user
   * countLocation get array of locations id for current user
   * then get locations by id in array
   * */
  async get(req, res, next) {
    const { user } = req.state;
    const { limit, offset } = getPagination(req.query, { limit: 100, offset: 0 });
    const countLocation = await locationService.findOneAndCount(user.id, limit, offset);
    const locations = await locationService.findAll(countLocation, user.id);

    res.status(200).send({ total: countLocation.count, locations });
  },

  /**
   * Get location information by one id
   * */
  async getById(req, res, next) {
    const { user } = req.state;
    const { locationId } = req.params;
    const location = await locationService.getLocationsById(user.id, [locationId]);

    res.status(200).send(location[0]);
  },

  /**
   * Get location information for all users
   * */
  async listing(req, res, next) {
    const { limit, offset } = getPagination(req.query, { limit: 100, offset: 0 });
    const { user } = req.state;

    const countLocation = await locationService.findAndCountActiveLocations(limit, offset);
    const locations = await locationService.getLocationsById(user.id, countLocation.rows);
    res.status(200).send({ total: countLocation.count, locations });
  },

  /**
   * Add location
   * Assign user
   * Create tasks to location by default
   * */
  async add(req, res, next) {
    const { address, name, city, province, postalCode, users } = req.body;

    // CHECK USERS
    if (users) {
      const usersCount = await userService.countActiveUserByList(users);
      if (usersCount !== users.length) return res.status(401).send("NOT ALL USERS ARE IN THE BASE");
    }

    // CREATE LOCATION
    const location = await locationService.add(address, name, city, province, postalCode);
    // BULK ASSIGN USERS
    if (users) await locationService.bulkAssign(users, location.id);
    // ADD TASKS LOCATION
    await locationService.bulkCreateLocationTasks(location.id);
    // RETURN ASSIGNED USERS
    const newLocation = await locationService.findOne(location.id);

    res.status(200).json(newLocation);
  },

  /**
   * Update location
   * reassign users
   * */
  async update(req, res, next) {
    const { id, address, name, city, province, postalCode, users } = req.body;
    const location = await locationService.findOne(id);
    if (!location) return res.status(400).json({ msg: "LOCATION IS NOT EXIST" });
    await locationService.update(id, address, name, city, province, postalCode);
    // ASSIGNED USERS REMOVE
    const currentUsersAssigned = location.users;
    await locationService.destroyUserAssign(currentUsersAssigned, location.id);
    // ASSIGNED NEW USERS SAVE
    await locationService.userAssign(users, location.id);

    const locationUpdate = await locationService.findOne(id);

    res.status(200).json(locationUpdate);
  },

  /**
   * Remove set user as inactive
   * */
  async remove(req, res, next) {
    const { id } = req.body;
    // CHECK LOCATION
    const location = await locationService.findOne(id);
    if (!location) return res.status(400).json({ msg: "LOCATION IS NOT EXIST" });
    // REMOVE USER
    await locationService.setInactive(id);
    res.status(200).json({ msg: "LOCATION REMOVED" });
  },

  async upload(req, res, next) {
    csv.parse(req.file.buffer, { columns: true }, async (err, locationsData) => {
      const locations = await locationsData.map((location) => {
        return {
          name: location["Location Name"],
          address: location["Location Address"],
          city: location["City"],
          province: location["Province"],
          postalCode: location["Postal Code"]
        };
      });

      await Locations.bulkCreate(locations);
    });

    res.status(200).json({ msg: "LOCATIONS UPLOAD" });
  },

  async uploadAllData(req, res, next) {
    csv.parse(req.file.buffer, { columns: true }, async (err, locationsData) => {

      const addDateInformation = (arr) => {
        return arr.map((item) => {
          item.created_at = new Date();
          item.updated_at = new Date();
          return item;
        });
      };

      // ADD TASK STATUSES
      const taskStatuses = [{ name: "Yes" }, { name: "No" }];
      await TaskStatus.bulkCreate(taskStatuses);

      // ADD TASK PLACE
      const taskPlaces = [{ name: "Roads" }, { name: "Sidewalks" }];
      await TaskPlace.bulkCreate(taskPlaces);

      // ADD LOCATIONS
      const locations = await locationsData.map((location) => {
        return {
          name: location["Location Name"],
          address: location["Location Address"],
          city: location["City"],
          province: location["Province"],
          postalCode: location["Postal Code"]
        };
      });

      await Locations.bulkCreate(locations);

      // ADD TASKS
      const tasks = [
        { name: "plowed", taskPlaceId: 1 },
        { name: "plowed", taskPlaceId: 2 },
        { name: "salted", taskPlaceId: 1 },
        { name: "salted", taskPlaceId: 2 },
        { name: "Ice Melter Applied", taskPlaceId: 2 }
      ];

      await Task.bulkCreate(tasks);

      // Add LOCATION TASKS
      const tasksNow = await Task.findAll();

      const locationIds = await Locations.findAll({ attributes: ["id"] });
      const locationIdsBbj = await locationIds.map(({ id }) => {
        return { location_id: id };
      });

      let locationTasks = locationIdsBbj.map(({ location_id }) =>
        tasksNow.map(({id}) => {
          return {
            locationId: location_id,
            taskId: id,
            createdAt: new Date(),
            updatedAt: new Date()
          };
        })
      );

      locationTasks = await flatten(locationTasks);
      await LocationsTasks.bulkCreate(locationTasks);
    });

    res.status(200).json({ msg: "LOCATIONS UPLOAD" });
  }
};
