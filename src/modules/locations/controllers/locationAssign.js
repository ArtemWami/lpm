const { Locations, User, UserLocations } = require("./../../../models");

module.exports = {
  async assignUserToLocation(req, res, next) {
    const { userId, locationsIds = [] } = req.body;
    // CHECK USER
    const user = await User.findOne({ where: { id: userId } });
    if (!user) return res.status(401).json({ message: "User not found" });

    // CHECK ASSIGNED LOCATIONS ON USER AND DESTROY ALL
    const assignedLocations = await UserLocations.findAll({ where: { userId }, attributes: ['userId', 'locationId'] });

    await assignedLocations.map( async ({ userId, locationId }) => {
      await UserLocations.destroy({ where: { userId, locationId }, force: true });
    });

    // ASSIGN USER TO LOCATIONS
    await locationsIds.map(async (locationId) => {
      // CHECK LOCATION
      const location = await Locations.findOne({ where: { id: locationId } });
      if (location) {
        // ASSIGN USER TO LOCATION
        await UserLocations.create({ locationId, userId });
      }
    });

    res.status(200).json({ message: `USER ${userId} ASSIGN TO LOCATIONS` });
  },

  async estrangeUserLocation(req, res, next) {
    const { userId, locationId } = req.body;
    // CHECK LOCATION
    const location = await Locations.findOne({ where: { id: locationId } });
    if (!location) return res.status(401).json({ message: "Location not found" });

    // CHECK USER
    const user = await User.findOne({ where: { id: userId } });
    if (!user) return res.status(401).json({ message: "User not found" });

    // CHECK ASSIGN USER TO LOCATION
    const isAssign = await UserLocations.findOne({ where: { locationId, userId } });
    if (!isAssign) return res.status(401).json({ message: "USER WAS NOT ASSIGN" });

    // ASSIGN USER
    await UserLocations.destroy({ where: { locationId, userId }, force: true });
    res.status(200).json({ message: `USER ${userId} ASSIGN TO LOCATION ${locationId} IS REMOVE` });
  }
};
