const request = require('supertest')
const app = require('../app')
const seed = require('../db/seeds/seed')
const db = require('../db/connection')
const data = require('../db/data/test-data/index')

beforeEach(() => {
    return seed(data)
})

afterAll(() => {
    return db.end()
})

describe('/api/topics', () => {
    describe('GET:', () => {
        describe('status 200:', () => {
            test('responds with array of topics with slug and decription', () => {
                return request(app)
                    .get('/api/topics')
                    .expect(200)
                    .then((result) => {
                        const topics = result.body.topics
                        topics.map((topic)=> {
                            expect(topic).toHaveProperty('description')
                            expect(topic).toHaveProperty('slug')
                    })
                })
            });
        });
        describe('status: 404', () => {
            test('responds with error message if topics table is empty', () => {
                return db
                .query(`DROP TABLE IF EXISTS comments;`)
                .then(() => {
                  return db.query(`DROP TABLE IF EXISTS articles;`);
                })
                .then(() => {
                  return db.query(`DROP TABLE IF EXISTS users;`);
                })
                .then(() => {
                    return db.query(`DELETE FROM topics;`)
                })
                .then(() => {
                    return request(app)
                    .get('/api/topics')
                    .expect(404)
                    .then((result) => {
                        expect(result.body.message).toBe('No topics found')
                    })
                })
            });
        });
    });
});