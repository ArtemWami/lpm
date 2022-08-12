const { User, Job } = require("./../../../models");
const { hashPassword } = require("../../../helpers/users");
const userService = require("../../../services/user");
const jobService = require('../../../services/job');

module.exports = {
  /**
   * Get information about current user,
   * if userId param will be send it return requested user
   * */
  async get(req, res, next) {
    const { id } = req.state.user;
    const { userId } = req.params;
    const searchId = userId ? userId : id;
    const user = await userService.findOne(searchId);
    if(!user) return res.status(404).json({ msg: "USER IS NOT EXIST" });
    res.status(200).send({ id, userId: user.id, ...user.dataValues });
  },

  /**
   * Create user
   * check user force (destroy ot not destroy)
   * and create
   * */
  async add(req, res, next) {
    const {
      name,
      lastName,
      email,
      companyName,
      city,
      province,
      postalCode,
      phone,
      password,
      role,
      address,
      force
    } = req.body;

    // CHECK USER
    const user = await userService.findOneByEmailForce(email);

    if (force !== true && user && user.deletedAt)
      return res.status(400).json({
        msg: "USER IS ARCHIVED",
        id: user.id
      });

    if (force !== true && user)
      return res.status(400).json({ msg: "USER IS EXIST" });

    if (user && !user.deletedAt && user.active === "inactive")
      return res.status(400).json({ msg: "USER IS EXIST IN INACTIVE STATUS" });

    const color = await userService.getRandomColor();
    const hashedPassword = await hashPassword(password);

    // USER CREATE
    const userCreated = await userService.create(
      name,
      lastName,
      email,
      companyName,
      city,
      province,
      postalCode,
      phone,
      hashedPassword,
      role,
      address,
      color
    );

    res.status(200).json({ msg: "USER ADD", userId: userCreated.id });
  },

  /**
   * User update
   * if user set inactive all open jobs
   * will be closed
   * */
  async update(req, res, next) {
    const {
      id,
      name,
      lastName,
      email,
      companyName,
      city,
      province,
      postalCode,
      phone,
      password,
      role,
      address,
      active
    } = req.body;

    // CHECK USER
    const user = await userService.findOneById(id);
    if (!user) return res.status(400).json({ msg: "USER IS NOT EXIST" });

    // CHECK DUPLICATE EMAIL
    if(email){
      const isEmailExists = await userService.findOneByEmailForce(email);
      if(isEmailExists && !isEmailExists.deletedAt && user.email !== email)
        return res.status(400).json({ msg: `USER WITH EMAIL ${email} IS EXIST` });
    }

    const hashedPassword = password ? await hashPassword(password) : undefined;

    // CLOSE OPEN JOBS
    if(active === 'inactive') await jobService.closeOpenJobsByUserId(id);

    // UPDATE USER
    await userService.update(
      id,
      name,
      lastName,
      email,
      companyName,
      city,
      province,
      postalCode,
      phone,
      hashedPassword,
      role,
      address,
      active
    );
    res.status(200).json({ msg: "USER IS UPDATE", userId: id });
  },

  /**
   * CHECK OPEN JOB USER BY USER ID
   * SET END_DATE (CLOSE - STOP, WITHOUT SET TASKS )
   * AND DESTROY USER
   * THIS JOBS CAN BE UPDATE BY ADMIN IN FUTURE
   * */
  async remove(req, res, next) {
    const { id } = req.body;
    // CHECK USER
    const user = await userService.findOneById(id);
    if (!user) return res.status(400).json({ msg: "USER IS NOT EXIST" });

    // CLOSE OPEN JOBS by user id
    await jobService.closeOpenJobsByUserId(id);

    // REMOVE USER
    await User.destroy({ where: { id } });
    res.status(200).json({ msg: "USER REMOVED" });
  },

  /**
   * RESTORE USER AFTER DELETE
   * */
  async restore(req, res, next) {
    const { userId } = req.params;

    // CHECK USER
    const user = await userService.findOneByIdForce(userId);
    if (!user) return res.status(400).json({ msg: "USER IS NOT EXIST" });
    if (!user && !user.deletedAt)
      return res.status(400).json({ msg: "USER IS EXIST BUT NOT IN ARCHIVE" });

    // RESTORE USER
    await userService.restore(userId);
    res.status(200).json({ msg: "USER RESTORED", userId });
  },

  /**
   * GET ALL USER INFORMATION
   * */
  async listing(req, res, next) {
    const users = await userService.findAll();
    res.status(200).send(users);
  }
};
