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
    describe("status: 400", () => {
      test("invalid article_id", () => {
        return request(app)
          .get("/api/articles/nonsense")
          .expect(400)
          .then((response) => {
            expect(response.body.message).toBe("Bad request");
          });
      });
      test("valid but non-existent article_id", () => {
        return request(app)
          .get("/api/articles/10000")
          .expect(404)
          .then((response) => {
            expect(response.body.message).toBe("This article doesn't exist");
          });
      });
    });
  });

  describe("PATCH:", () => {
    describe("status: 200", () => {
      test("responds with the updated article object", () => {
        return request(app)
          .patch("/api/articles/1")
          .send({
            title: "This is a new title",
          })
          .expect(200)
          .then((result) => {
            const expectedResponse = {
              article_id: 1,
              title: "This is a new title",
              topic: "mitch",
              author: "butter_bridge",
              body: "I find this existence challenging",
              created_at: "2020-07-09T20:11:00.000Z",
              votes: 100,
              article_img_url:
                "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
            };
            expect(result.body.article).toMatchObject(expectedResponse);
          });
      });

      test("should update more than one field if specified", () => {
        return request(app)
          .patch("/api/articles/1")
          .send({
            title: "This is a new title",
            body: 'This is a new body'
          })
          .expect(200)
          .then((result) => {
            const expectedResponse = {
              article_id: 1,
              title: "This is a new title",
              topic: "mitch",
              author: "butter_bridge",
              body: 'This is a new body',
              created_at: "2020-07-09T20:11:00.000Z",
              votes: 100,
              article_img_url:
                "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
            };
            expect(result.body.article).toMatchObject(expectedResponse);
        });
      });
      test("should increase votes by positive int specified", () => {
        return request(app)
          .patch("/api/articles/1")
          .send({
            inc_votes: 5
          })
          .expect(200)
          .then((result) => {
            const expectedResponse = {
              article_id: 1,
              title: "Living in the shadow of a great man",
              topic: "mitch",
              author: "butter_bridge",
              body: "I find this existence challenging",
              created_at: "2020-07-09T20:11:00.000Z",
              votes: 105,
              article_img_url:
                "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
            };
            expect(result.body.article).toMatchObject(expectedResponse);
          });
      });
      test("should decrease votes by negative int specified", () => {
        return request(app)
          .patch("/api/articles/1")
          .send({
            inc_votes: -5
          })
          .expect(200)
          .then((result) => {
            const expectedResponse = {
              article_id: 1,
              title: "Living in the shadow of a great man",
              topic: "mitch",
              author: "butter_bridge",
              body: "I find this existence challenging",
              created_at: "2020-07-09T20:11:00.000Z",
              votes: 95,
              article_img_url:
                "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
            };
            expect(result.body.article).toMatchObject(expectedResponse);
          });
        });
      });
    describe("status: 400", () => {
      test("should not update user if no req body supplied", () => {
        return request(app)
          .patch("/api/articles/1")
          .send()
          .expect(400)
          .then((result) => {
            expect(result.body.message).toBe("Bad request");
          });
      });
      test("should not update invalid article fields", () => {
        return request(app)
          .patch("/api/articles/1")
          .send({
            test: "test",
          })
          .expect(400)
          .then((result) => {
            expect(result.body.message).toBe("Bad request");
          });
      });
      test("invalid article_id", () => {
        return request(app)
          .patch("/api/articles/nonsense")
          .send({
            inc_votes: -5
          })
          .expect(400)
          .then((result) => {
            expect(result.body.message).toBe("Bad request");
          });
      });
      test('should not update votes if inc_votes is not an int', () => {
        return request(app)
          .patch("/api/articles/1")
          .send({
            inc_votes: 'test'
          })
          .expect(400)
          .then((result) => {
            expect(result.body.message).toBe("Bad request");
          });
      });
      test('should not update article_id', () => {
        return request(app)
          .patch("/api/articles/1")
          .send({
            article_id: 2000
          })
          .expect(400)
          .then((result) => {
            expect(result.body.message).toBe("Bad request");
          });
      });
      test('should not update author', () => {
        return request(app)
          .patch("/api/articles/1")
          .send({
            author: 'icellusedkars'
          })
          .expect(400)
          .then((result) => {
            expect(result.body.message).toBe("Bad request");
          });
      });
      test('should not update created_at', () => {
        return request(app)
          .patch("/api/articles/1")
          .send({
            created_at: Date.now()
          })
          .expect(400)
          .then((result) => {
            expect(result.body.message).toBe("Bad request");
          });
      });
      
    });
    describe("status: 404", () => {
      test("valid but non-existent article_id", () => {
        return request(app)
          .patch("/api/articles/9000")
          .send({
            inc_votes: -5
          })
          .expect(404)
          .then((result) => {
            expect(result.body.message).toBe("This article doesn't exist");
          });
      });
    });
  });
});

describe("/api/articles", () => {
  describe("GET: ", () => {
    describe("status: 200", () => {
      test("responds with an array of articles", () => {
        return request(app)
          .get("/api/articles")
          .expect(200)
          .then((result) => {
            const articles = result.body.articles;
            expect(articles.length).toBe(12);
            articles.forEach((article) => {
              expect(article).toHaveProperty("author");
              expect(article).toHaveProperty("title");
              expect(article).toHaveProperty("article_id");
              expect(article).toHaveProperty("topic");
              expect(article).toHaveProperty("created_at");
              expect(article).toHaveProperty("votes");
              expect(article).toHaveProperty("article_img_url");
              expect(article).toHaveProperty("comment_count");
            });
          });
      });

      test("articles are sorted by date in descending order by default", () => {
        return request(app)
          .get("/api/articles")
          .expect(200)
          .then((result) => {
            const articles = result.body.articles;
            expect(articles).toBeSortedBy("created_at", {
              descending: true,
            });
          });
      });

      test("articles include an accurate comment_count", () => {
        return request(app)
          .get("/api/articles")
          .expect(200)
          .then((result) => {
            const articles = result.body.articles;
            const article1 = articles.find((article) => {
              return article.article_id === 1;
            });
            const article2 = articles.find((article) => {
              return article.article_id === 2;
            });
            const article3 = articles.find((article) => {
              return article.article_id === 3;
            });
            expect(article1.comment_count).toBe(11);
            expect(article2.comment_count).toBe(0);
            expect(article3.comment_count).toBe(2);
          });
      });

      test("articles do not include a body property", () => {
        return request(app)
          .get("/api/articles")
          .expect(200)
          .then((result) => {
            const articles = result.body.articles;
            expect(articles.length).toBe(12);
            articles.forEach((article) => {
              expect(article).not.toHaveProperty("body");
            });
          });
      });

      describe("query by: ", () => {
        test("author", () => {
          return request(app)
            .get("/api/articles?author=butter_bridge")
            .expect(200)
            .then((result) => {
              const articles = result.body.articles;
              expect(articles.length).toBe(3);
              articles.forEach((article) => {
                expect(article.author).toBe("butter_bridge");
              });
            });
        });

        test("topic", () => {
          return request(app)
            .get("/api/articles?topic=mitch")
            .expect(200)
            .then((result) => {
              const articles = result.body.articles;
              expect(articles.length).toBe(11);
              articles.forEach((article) => {
                expect(article.topic).toBe("mitch");
              });
            });
        });

        test("sort_by", () => {
          return request(app)
            .get("/api/articles?sort_by=author")
            .expect(200)
            .then((result) => {
              const articles = result.body.articles;
              expect(articles).toBeSortedBy("author", { descending: true });
            });
        });

        test("order", () => {
          return request(app)
            .get("/api/articles?order=asc")
            .expect(200)
            .then((result) => {
              const articles = result.body.articles;
              expect(articles).toBeSortedBy("created_at", {
                descending: false,
              });
            });
        });

        test("author & topic", () => {
          return request(app)
            .get("/api/articles?author=butter_bridge&topic=mitch")
            .expect(200)
            .then((result) => {
              const articles = result.body.articles;
              expect(articles.length).toBe(3);
              articles.forEach((article) => {
                expect(article.topic).toBe("mitch");
                expect(article.author).toBe("butter_bridge");
              });
            });
        });

        test("topic which exists but has no articles", () => {
          return request(app)
            .get("/api/articles?topic=paper")
            .expect(200)
            .then((result) => {
              const articles = result.body.articles;
              expect(articles.length).toBe(0);
            });
        });
      });
    });
    describe("status: 400", () => {
      test("invalid sort_by query", () => {
        return request(app)
          .get("/api/articles?sort_by=nonsense")
          .expect(400)
          .then((result) => {
            expect(result.body.message).toBe("Invalid sort query");
          });
      });

      test("invalid order query", () => {
        return request(app)
          .get("/api/articles?order=nonsense")
          .expect(400)
          .then((result) => {
            expect(result.body.message).toBe("Invalid order query");
          });
      });
    });
    describe("status: 404", () => {
      test("invalid author query", () => {
        return request(app)
          .get("/api/articles?author=nonsense")
          .expect(404)
          .then((result) => {
            expect(result.body.message).toBe("This author doesn't exist");
          });
      });

      test("invalid topic query", () => {
        return request(app)
          .get("/api/articles?topic=nonsense")
          .expect(404)
          .then((result) => {
            expect(result.body.message).toBe("This topic doesn't exist");
          });
      });
    });
  });
});

describe("/api/articles/:article_id/comments", () => {
  describe("GET:", () => {
    describe("status: 200", () => {
      test("responds with array of comments for specified article", () => {
        return request(app)
          .get("/api/articles/3/comments")
          .expect(200)
          .then((result) => {
            const comments = result.body.comments;
            expect(comments[0].article_id).toBe(3);
            expect(comments[1].article_id).toBe(3);
            expect(comments.length).toBe(2);
          });
      });

      test("each comment object has required properties", () => {
        return request(app)
          .get("/api/articles/3/comments")
          .expect(200)
          .then((result) => {
            const comments = result.body.comments;
            comments.forEach((comment) => {
              expect(comment.article_id).toBe(3);
              expect(comment).toHaveProperty("comment_id");
              expect(comment).toHaveProperty("votes");
              expect(comment).toHaveProperty("created_at");
              expect(comment).toHaveProperty("author");
              expect(comment).toHaveProperty("body");
              expect(comment).toHaveProperty("article_id");
            });
          });
      });

      test("comments are sorted by date in descending order by default", () => {
        return request(app)
          .get("/api/articles/3/comments")
          .expect(200)
          .then((result) => {
            const comments = result.body.comments;
            expect(comments).toBeSortedBy("created_at", { descending: true });
          });
      });
      test("article exists but has no comments", () => {
        return request(app)
          .get("/api/articles/2/comments")
          .expect(200)
          .then((result) => {
            const comments = result.body.comments;
            expect(comments.length).toBe(0);
          });
      });
      describe("query by:", () => {
        test("sort_by", () => {
          return request(app)
            .get("/api/articles/3/comments?sort_by=votes")
            .expect(200)
            .then((result) => {
              const comments = result.body.comments;
              expect(comments).toBeSortedBy("votes");
            });
        });
        test("order", () => {
          return request(app)
            .get("/api/articles/3/comments?order=asc")
            .expect(200)
            .then((result) => {
              const comments = result.body.comments;
              expect(comments).toBeSortedBy("created_at");
            });
        });
      });
    });

    describe("status: 400", () => {
      test("invalid artical id", () => {
        return request(app)
          .get("/api/articles/nonsense/comments")
          .expect(400)
          .then((result) => {
            expect(result.body.message).toBe("Bad request");
          });
      });
    });
    describe("status: 404", () => {
      test("valid but non-existent article_id", () => {
        return request(app)
          .get("/api/articles/3000/comments")
          .expect(404)
          .then((result) => {
            expect(result.body.message).toBe("This article doesn't exist");
          });
      });
    });
  });

  describe("POST:", () => {
    describe("status: 201", () => {
      test("responds with the posted comment", () => {
        return request(app)
          .post("/api/articles/2/comments")
          .send({
            username: "icellusedkars",
            body: "This is the best comment ever written!",
          })
          .expect(201)
          .then((result) => {
            const response = result.body.comment;
            const expectedResponse = {
              comment_id: 19,
              body: "This is the best comment ever written!",
              article_id: 2,
              votes: 0,
              author: "icellusedkars",
            };
            expect(response).toHaveProperty("created_at");
            expect(response).toMatchObject(expectedResponse);
          });
      });
      test("additional properties in req body are ignored", () => {
        return request(app)
          .post("/api/articles/2/comments")
          .send({
            username: "icellusedkars",
            body: "This is the best comment ever written!",
            test: "a test property",
          })
          .expect(201)
          .then((result) => {
            const response = result.body.comment;
            const expectedResponse = {
              comment_id: 19,
              body: "This is the best comment ever written!",
              article_id: 2,
              votes: 0,
              author: "icellusedkars",
            };
            expect(response).toHaveProperty("created_at");
            expect(response).toMatchObject(expectedResponse);
          });
      });
    });

    describe("status: 404", () => {
      test("valid but non-existent article_id", () => {
        return request(app)
          .post("/api/articles/9000/comments")
          .send({
            username: "icellusedkars",
            body: "This is the best comment ever written!",
          })
          .expect(404)
          .then((result) => {
            expect(result.body.message).toBe("This article doesn't exist");
          });
      });
    });

    describe("status 400", () => {
      test("request body missing required properties", () => {
        return request(app)
          .post("/api/articles/2/comments")
          .send({
            username: "icellusedkars",
          })
          .expect(400)
          .then((result) => {
            expect(result.body.message).toBe("Bad request");
          });
      });

      test("invalid article_id", () => {
        return request(app)
          .post("/api/articles/nonsense/comments")
          .send({
            username: "icellusedkars",
            body: "This is the best comment ever written!",
          })
          .expect(400)
          .then((result) => {
            expect(result.body.message).toBe("Bad request");
          });
      });
    });
  });
});

describe("/api/comments/:comment_id", () => {
  describe("DELETE:", () => {
    describe("status: 204", () => {
      test("deletes comment by given comment_id", () => {
        return request(app).delete("/api/comments/1").expect(204);
      });
    });

    describe("status: 400", () => {
      test("invalid comment_id", () => {
        return request(app)
          .delete("/api/comments/nonsense")
          .expect(400)
          .then((result) => {
            expect(result.body.message).toBe("Bad request");
          });
      });
    });

    describe("status: 404", () => {
      test("valid but non-existent comment_id", () => {
        return request(app)
          .delete("/api/comments/1000")
          .expect(404)
          .then((result) => {
            expect(result.body.message).toBe("This comment doesn't exist");
          });
      });
    });
  });
});
