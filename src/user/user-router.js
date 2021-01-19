const express = require("express");
const UserService = require("./user-service");
const { requireAuth } = require("../middleware/jwt-auth");

const userRouter = express.Router();
const bodyParser = express.json();

const REGEX_UPPER_LOWER_NUMBER_SPECIAL = /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&])[\S]+/;

userRouter
  .get("/", requireAuth, (req, res) => {
    res.send("hello from user router");
  })
  .post("/", bodyParser, (req, res, next) => {
    const knexInstance = req.app.get("db");
    const { password, username, name } = req.body;

    for (const field of ["password", "username", "name"]) {
      if (!req.body[field]) {
        return res.status(400).json({
          error: `${field} is required`,
        });
      }
    }

    if (password.length < 8) {
      return res.status(400).json({
        error: `Password needs to be longer than 8 characters`,
      });
    }

    if (password.length > 35) {
      return res.status(400).json({
        error: `Password needs to be shorter than 35 characters`,
      });
    }

    if (!REGEX_UPPER_LOWER_NUMBER_SPECIAL.test(password)) {
      return res.status(400).json({
        error: `Password must contain one upper case, lower case, number and special character`,
      });
    }

    UserService.isUsernameTaken(knexInstance, username).then((hasUser) => {
      if (hasUser) {
        return res.status(400).json({
          error: `Username already exist`,
        });
      }

      return UserService.hashPassword(password).then((hashedPassword) => {
        const newUser = {
          username,
          password: hashedPassword,
          name,
        };
        return UserService.insertUser(knexInstance, newUser).then((user) => {
          res.status(201).json(UserService.serializeUser(user));
        });
      });
    });
  });

module.exports = userRouter;
