const { User } = require('../src/models');
const { hashPassword } = require('../src/helpers/users');

const tableName = 'users';
const users = [
  {
    name: 'TEST',
    last_name: 'USER1',
    email: 'worker1@example.com',
    email_verified: true,
    password: 'qwerty123',
    role: User.ROLE_WORKER,
    created_at: new Date(),
    updated_at: new Date(),
  },
  // {
  //   name: 'Denis',
  //   last_name: 'Ignatov',
  //   email: 'worker2@example.com',
  //   email_verified: true,
  //   password: 'qwerty123',
  //   role: User.ROLE_WORKER,
  //   created_at: new Date(),
  //   updated_at: new Date(),
  // },
  // {
  //   name: 'Sergey',
  //   last_name: 'Vladimirov',
  //   email: 'worker3@example.com',
  //   email_verified: true,
  //   password: 'qwerty123',
  //   role: User.ROLE_WORKER,
  //   created_at: new Date(),
  //   updated_at: new Date(),
  // },
  {
    name: 'TEST',
    last_name: 'USER2',
    email: 'tosag73893@aalyaa.com',
    email_verified: true,
    password: '12345678',
    role: User.ROLE_WORKER,
    created_at: new Date(),
    updated_at: new Date(),
  },
  // {
  //   name: 'Viktor',
  //   last_name: 'Ismailov',
  //   email: 'test@aalyaa.com',
  //   email_verified: true,
  //   password: 'password',
  //   role: User.ROLE_WORKER,
  //   created_at: new Date(),
  //   updated_at: new Date(),
  // },
  {
    name: 'Admin',
    last_name: 'Adminov',
    email: 'admin@gmail.com',
    email_verified: true,
    password: 'adminPassword',
    role: User.ROLE_MASTER,
    created_at: new Date(),
    updated_at: new Date(),
  },
];

const up = async (queryInterface) => {
  const data = await Promise.all(
    users.map(async (user) => {
      const password = await hashPassword(user.password);
      return {
        ...user,
        password,
      };
    }),
  );

  return queryInterface.bulkInsert(tableName, data);
};

const down = (queryInterface) => {
  return queryInterface.bulkDelete(tableName, {
    email: users.map(({ email }) => email),
  });
};

module.exports = {
  up,
  down,
};
