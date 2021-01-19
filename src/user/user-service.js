const bcrypt = require("bcryptjs");

const UserService = {
  isUsernameTaken(knex, username) {
    return knex("user")
      .where({ username })
      .first()
      .then((user) => !!user);
  },
  insertUser(knex, newUser) {
    return knex
      .insert(newUser)
      .into("user")
      .returning("*")
      .then((user) => user[0]);
  },
  hashPassword(password) {
    return bcrypt.hash(password, 12);
  },
  serializeUser(user) {
    return {
      id: user.id,
      name: user.name,
      username: user.username,
    };
  },
};

module.exports = UserService;
