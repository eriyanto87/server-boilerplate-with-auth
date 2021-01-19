const knex = require("knex");
const app = require("../src/app");
const helpers = require("./helpers");
const bcrypt = require("bcryptjs");
const supertest = require("supertest");

describe("User Endpoint", () => {
  let db;

  before("make knex instance", () => {
    db = knex({
      client: "pg",
      connection: process.env.TEST_DATABASE_URL,
    });
    return app.set("db", db);
  });
  after("disconnect from db", () => db.destroy());

  before("cleanup", () => helpers.cleanTables(db));

  afterEach("cleanup", () => helpers.cleanTables(db));

  describe(`POST /api/user, given a valid user, happy path`, () => {
    it("responds 201 and serialized", () => {
      const newUser = {
        id: 1,
        username: "test-account",
        password: "Password1!",
        name: "testing",
      };
      return supertest(app)
        .post(`/api/user`)
        .send(newUser)
        .expect(201)
        .expect((res) => {
          expect(res.body).to.have.property("id");
          expect(res.body.username).to.eql(newUser.username);
          expect(res.body.name).to.eql(newUser.name);
          expect(res.body).to.not.have.property("password");
        });
    });
    it("stores the new user in db with bcryped password", () => {
      const newUser = {
        id: 1,
        username: "test-account",
        password: "Password1!",
        name: "testing",
      };
      return supertest(app)
        .post("/api/user")
        .send(newUser)
        .expect((res) =>
          db
            .from("user")
            .select("*")
            .where({ id: res.body.id })
            .first()
            .then((row) => {
              expect(row.username).to.eql(newUser.username);
              expect(row.name).to.eql(newUser.name);
              return bcrypt.compare(newUser.password, row.password);
            })
            .then((compareMatch) => {
              expect(compareMatch).to.be.true;
            })
        );
    });
  });
});
