const tableName = 'locations';
const locations = [
  {
    name: 'TEST LOCATION 1',
    address: 'Pushkinska street 12 Kharkiv city',
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    name: 'TEST LOCATION 2',
    address: 'Shevchenko street 67 Kharkiv',
    created_at: new Date(),
    updated_at: new Date(),
  },
  // {
  //   name: 'Constitution Square',
  //   address: 'Freedom Avenue 54',
  //   created_at: new Date(),
  //   updated_at: new Date(),
  // },
  // {
  //   name: 'Factory Prime',
  //   address: 'University street 123',
  //   created_at: new Date(),
  //   updated_at: new Date(),
  // },
  // {
  //   name: 'Planetarium',
  //   address: 'Gagarin Avenue 81',
  //   created_at: new Date(),
  //   updated_at: new Date(),
  // },
  // {
  //   name: 'Government building',
  //   address: 'Shevchenko street 67',
  //   created_at: new Date(),
  //   updated_at: new Date(),
  // },
  // {
  //   name: 'Machine building plant',
  //   address: 'Metallurgov street 34',
  //   created_at: new Date(),
  //   updated_at: new Date(),
  // },
  // {
  //   name: 'Porcelain factory',
  //   address: 'Parkova Street 81',
  //   created_at: new Date(),
  //   updated_at: new Date(),
  // },
  // {
  //   name: 'Palace of Sports',
  //   address: 'Sport Street 81',
  //   created_at: new Date(),
  //   updated_at: new Date(),
  // },
];

const up = (queryInterface) => {
  return queryInterface.bulkInsert(tableName, locations);
};

const down = (queryInterface) => {
  return queryInterface.bulkDelete(tableName, {
    name: locations.map(({ name }) => name),
  });
};

module.exports = {
  up,
  down,
};
