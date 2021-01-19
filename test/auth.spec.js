const knex = require("knex");
const app = require("../src/app");
const helpers = require("./helpers");
const supertest = require("supertest");

describe("Auth Endpoints", () => {
  let db;

  const testUsers = helpers.makeUsersArray();
  const testUser = testUsers[0];

  before("make knex instance", () => {
    db = knex({
      client: "pg",
      connection: process.env.TEST_DATABASE_URL,
    });
    app.set("db", db);
  });

  after("disconnect from db", () => db.destroy());

  before("cleanup", () => helpers.cleanTables(db));

  afterEach("cleanup", () => helpers.cleanTables(db));

  describe("POST /api/auth", () => {
    beforeEach("insert users", () => helpers.seedUsers(db, testUsers));

    it("responds with 200 and JWT auth token using secret when valid credentials", () => {
      const validCredentials = {
        username: testUser.username,
        password: testUser.password,
      };
      return supertest(app)
        .post("/api/auth/login")
        .send(validCredentials)
        .expect(200)
        .then((res) => {
          expect(res.body).to.be.an("object");
          expect(res.body.authToken).to.be.an("string");
        });
    });
  });
});
