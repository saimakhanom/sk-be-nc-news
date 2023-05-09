const request = require("supertest");
const app = require("../app");
const seed = require("../db/seeds/seed");
const db = require("../db/connection");
const data = require("../db/data/test-data/index");

beforeEach(() => {
  return seed(data);
});

afterAll(() => {
  return db.end();
});

describe("/api/topics", () => {
  describe("GET:", () => {
    describe("status 200:", () => {
      test("responds with array of topics with slug and decription", () => {
        return request(app)
          .get("/api/topics")
          .expect(200)
          .then((result) => {
            const topics = result.body.topics;
            if (topics.length > 0) {
              topics.forEach((topic) => {
                expect(topic).toHaveProperty("description");
                expect(topic).toHaveProperty("slug");
              });
            }
          });
      });
    });
  });
});
