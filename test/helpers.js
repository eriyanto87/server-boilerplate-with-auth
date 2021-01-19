const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

function cleanTables(db) {
  return db.raw(`TRUNCATE TABLE "user" RESTART IDENTITY CASCADE;`);
}

function makeAuthHeader(user, secret = process.env.JWT_SECRET) {
  const token = jwt.sign(
    {
      id: user.id,
    },
    secret,
    {
      subject: user.username,
      algorithm: "HS256",
    }
  );
  return `Bearer ${token}`;
}

function makeUsersArray() {
  return [
    {
      id: 1,
      username: "test-user-1",
      name: "one",
      password: "password1!",
    },
    {
      id: 2,
      username: "test-user-2",
      name: "two",
      password: "password2!",
    },
  ];
}

function seedUsers(db, users) {
  const insertusers = users.map((user) => {
    const { username, password, name } = user;
    return {
      username,
      name,
      password: bcrypt.hashSync(password, 1),
    };
  });
  return db.into("user").insert(insertusers);
}

module.exports = {
  cleanTables,
  makeAuthHeader,
  makeUsersArray,
  seedUsers,
};
