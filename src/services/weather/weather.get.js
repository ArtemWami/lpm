const axios = require('axios');
const OPEN_WEATHER_KEY = process.env.OPEN_WEATHER_KEY;
const { CityList } = require("./../../models");

const getWeatherInfo = async (city) => {
  const config = {
    method: 'get',
    url: `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${OPEN_WEATHER_KEY}`,
    headers: { }
  };

  const weather = axios(config).catch((err) => {
    console.log(err);
  });

  const weatherResult = await Promise.all([weather]);

  return weatherResult ? weatherResult[0].data : undefined;
}

const getAllWeather = async () => {
  const cities = await CityList.findAll({ attributes: ['name'] });
  await cities.map(async ({ name }, index) => {
    setTimeout(async () => {
      const weather = await getWeatherInfo(name);
      const weatherSave = {
        time: weather.dt,
        temperature: weather.main.temp,
        fillLikeTemperature: weather.main.feels_like,
        icon: weather.weather.map(({ icon }) => icon),
        description: weather.weather.map(({ description }) => description),
        pop: '',
        windSpeed: weather.wind.speed,
        windGustSpeed: weather.wind.gust,
        // rainPrecipitation: weather.rain['1h'] || '',
        // snowPrecipitation: weather.snow['1h'] || ''
      }
      console.log(weatherSave);
    }, 2000 * index);
  });
  return 1;
}

module.exports = {
  getWeatherInfo,
  getAllWeather
};
