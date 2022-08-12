const { User, Job } = require("./../../../models");
const weatherService = require("../../../services/weather");

module.exports = {
  /**
   * Get current weather
   * */
  async get(req, res, next) {
    // const weather = await weatherService.getWeatherInfo("Unioinville");
    const weather = await weatherService.getAllWeather();
    res.status(200).json(weather);
  }
};
