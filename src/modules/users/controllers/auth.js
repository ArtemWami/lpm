const { User, UserLocations } = require("./../../../models");
const { hashPassword, comparePassword } = require("../../../helpers/users");
const jwt = require("jsonwebtoken");
const { ses } = require("./../../../services/aws/client");
const csv = require("csv");
const userService = require("../../../services/user");

module.exports = {
  // SET PASSWORD
  async setPassword(req, res, next) {
    const { email, password } = req.body;

    // CHECK USER
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(400).json({ msg: "USER IS NOT EXIST" });

    // SET PASSWORD
    const hashedPassword = await hashPassword(password);
    await User.update(
      { password: hashedPassword },
      { where: { id: user.id } }
    );

    res.status(200).json({ msg: "USER PASSWORD UPDATE" });
  },
  // LOGIN
  async login(req, res, next) {
    const { email, password } = req.body;
    const originHost = req.get('origin');

    // CHECK USER
    const user = await User.findOne({ where: { email, active: 'active' } });
    if (!user) return res.status(400).send("ACTIVE USER IS NOT EXIST");

    // CHECK MASTER AUTH
    const checkAuthAdminInClient = originHost === 'http://lpm-fe.s3-website.ca-central-1.amazonaws.com' && user.role === User.ROLE_MASTER;
    if(checkAuthAdminInClient) return res.status(400).send( { msg: "MASTER CAN NOT BE AUTHORIZE AS USER (WORKER)" } );

    const checkAuthAdminInAdmin = originHost === 'http://admin.lpmlogs.ca' && user.role !== User.ROLE_MASTER;
    if(checkAuthAdminInAdmin) return res.status(400).send( { msg: "ONLY MASTER CAN BE AUTHORIZE IN ADMIN PANEL" } );

    // CHECK PASSWORD
    const matched = await comparePassword(password, user.password);
    if (!matched) return res.status(401).json({ msg: "PASSWORD IS INVALID" });

    // CREATE TOKEN
    const accessToken = await jwt.sign(
      {
        id: user.id,
        email,
        role: user.role
      },
      process.env.JWT_KEY,
      { expiresIn: process.env.ACCESS_TOKEN_EXP }
    );

    res.status(200).send({ accessToken });
  },

  async forgotPassword(req, res, next) {
    const { email } = req.body;
    // CHECK USER
    const user = await User.findOne({ where: { email, active: 'active' } });
    if (!user) return res.status(400).send("USER IS NOT EXIST");

    // CREATE TOKEN
    const accessToken = await jwt.sign(
      {
        id: user.id,
        email,
        role: User.ROLE_WORKER
      },
      process.env.JWT_KEY,
      { expiresIn: process.env.ACCESS_TOKEN_EXP }
    );

    const url = `${process.env.PROTOCOL}://${process.env.SITE_URL}/forgot/password?token=${accessToken}`;
    const html = `<a href=${url}>${url}</a>`;

    const params = {
      Source: process.env.EMAIL_SOURCE,
      ReplyToAddresses: [process.env.EMAIL_SOURCE],
      Destination: { CcAddresses: [], ToAddresses: [email] },
      Message: {
        Subject: { Charset: "UTF-8", Data: "FORGOT PASSWORD" },
        Body: { Html: { Charset: "UTF-8", Data: html }, Text: { Charset: "UTF-8", Data: "text" } }
      }
    };

    await ses.sendEmail(params).promise();

    res.status(200).json({ msg: "EMAIL SEND" });
  },

  async upload(req, res, next) {
    csv.parse(req.file.buffer, { columns: true }, async (err, usersData) => {
      const users = usersData.map(async (user, index) => {
        setTimeout(async () => {
          const password = await hashPassword(user["Password"]);
          const color = await userService.getRandomColor();
          const userInsert = {
            name: user["First Name"],
            lastName: user["Last Name"],
            email: user["Email"],
            color,
            role: User.ROLE_WORKER,
            password: password
          };

          await User.create(userInsert);
        }, index * 2000);
      });
    });

    res.status(200).json({ msg: "USER UPLOAD" });
  },

  async uploadAssign(req, res, next) {
    csv.parse(req.file.buffer, { columns: true }, async (err, usersData) => {
      usersData.shift();
      const userLocationsData = await usersData.map((user) => {
        const locations = user["Locations"] === "All"
          ? [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33 ]
          : user["Locations"].split(',');

        return {
          userId: user.userId,
          locations
        };
      });

      const bulkAssignData = await userLocationsData.map((userLocData) => {
        return userLocData.locations.map((locationId) => {
          const newLocationId = +userLocData.userId === 30
          ? +locationId : +locationId - 1
          // const newLocationId = +locationId;
          return {
            userId: +userLocData.userId,
            locationId: newLocationId
          }
        });
      });

      const bulkAssign = await bulkAssignData.reduce((a, b) => {
        return a.concat(b);
      });

      bulkAssign.map((assign, index) => {
          UserLocations.create(assign)
            .then()
            .catch((err) => {
              console.log('ERROR EXAMPLE', assign);
            })
      });
    });

    res.status(200).json({ msg: "USER UPLOAD" });
  }
};
