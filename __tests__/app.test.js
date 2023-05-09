const request = require("supertest");
const app = require("../app");
const seed = require("../db/seeds/seed");
const db = require("../db/connection");
const data = require("../db/data/test-data/index");
const endpoints = require('../endpoints.json')

beforeEach(() => {
  return seed(data);
});

afterAll(() => {
  return db.end();
});

describe("/api", () => {
  describe("GET: status: 200", () => {
    test.only("responds with an array of available endpoints", () => {
      const expectedResponse = endpoints;
      return request(app)
        .get('/api')
        .expect(200)
        .then((response) => {
          console.log(response.body.endpoints)
          expect(response.body.endpoints).toEqual(expectedResponse);
      })
    });
  });
});

describe("/api/topics", () => {
  describe("GET: status 200:", () => {
    test("responds with array of topics with slug and decription", () => {
      return request(app)
        .get("/api/topics")
        .expect(200)
        .then((response) => {
          const topics = response.body.topics;
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
