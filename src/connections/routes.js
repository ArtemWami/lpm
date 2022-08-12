const express = require("express");

const router = express.Router();

router.use("/user", require("../modules/users/routes"));
router.use("/locations", require("../modules/locations/routes"));
router.use("/", require("../modules/jobs/routes"));
router.use("/city", require("../modules/cityList/routes"));
router.use("/weather", require("../modules/weather/routes"));

module.exports = router;
