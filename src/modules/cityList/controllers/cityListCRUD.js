const { User, Job } = require("./../../../models");
const cityService = require("../../../services/city");

module.exports = {
  /**
   *
   * */
  async get(req, res, next) {
    res.status(200).json({msg: 111});
  },

  /**
   * Add base data in city list. This information use by id.
   * */
  async add(req, res, next) {
    const { name } = req.body;
    const cityCreated = await cityService.create(name);
    res.status(200).json({ msg:  'CITY CREATED', cityCreated });
  },

  /**
   *
   * */
  async update(req, res, next) {
    res.status(200).json({msg:  333});
  },

  /**
   *
   * */
  async remove(req, res, next) {
    res.status(200).json({ msg: 444 });
  }
};
