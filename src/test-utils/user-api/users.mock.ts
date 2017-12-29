import * as faker from 'faker';

export const data = (() => {
  const d = { users: [] };
  // Create 1000 users
  for (let i = 0; i < 1000; i++) {
    const fname = faker.name.firstName(0);
    const lname = faker.name.lastName(0);

    d.users.push({
      id: i,
      name: `${fname} ${lname}`,
      username: faker.internet.userName(fname, lname),
      email: faker.internet.email(fname, lname),

      street: faker.address.streetAddress(),
      suite: faker.address.streetSuffix(),
      city: faker.address.city(),
      zipcode: faker.address.zipCode(),


      phone: faker.phone.phoneNumber('+33# ## ## ## ##'),
    });
  }
  return d;
})();
