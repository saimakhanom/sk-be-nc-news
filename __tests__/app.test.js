const request = require("supertest");
const app = require("../app");
const seed = require("../db/seeds/seed");
const db = require("../db/connection");
const data = require("../db/data/test-data/index");
const endpoints = require("../endpoints.json");

beforeEach(() => {
  return seed(data);
});

afterAll(() => {
  return db.end();
});

describe("/api", () => {
  describe("GET: status: 200", () => {
    test("responds with an array of available endpoints", () => {
      const expectedResponse = endpoints;
      return request(app)
        .get("/api")
        .expect(200)
        .then((response) => {
          expect(response.body.endpoints).toEqual(expectedResponse);
        });
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
          expect(topics.length).toBe(3);
          topics.forEach((topic) => {
            expect(topic).toHaveProperty("description");
            expect(topic).toHaveProperty("slug");
          });
        });
    });
  });
});

describe("/api/articles/:article_id", () => {
  describe("GET:", () => {
    describe("status: 200", () => {
      test("responds with article object", () => {
        return request(app)
          .get("/api/articles/1")
          .expect(200)
          .then((response) => {
            const article = response.body.article;
            const expected = {
              article_id: 1,
              article_img_url:
                "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
              author: "butter_bridge",
              body: "I find this existence challenging",
              created_at: "2020-07-09T20:11:00.000Z",
              title: "Living in the shadow of a great man",
              topic: "mitch",
              votes: 100,
            };
            expect(article).toMatchObject(expected);
          });
      });
    });
    describe('status: 400', () => {
      test('invalid article_id', () => {
        return request(app)
          .get('/api/articles/nonsense')
          .expect(400)
          .then((response) => {
          expect(response.body.message).toBe("Bad request")
        })
      });
      test('valid but non-existent article_id', () => {
        return request(app)
          .get('/api/articles/10000')
          .expect(404)
          .then((response) => {
          expect(response.body.message).toBe("This article doesn't exist")
        })
      });
    });
  });
});
