const db = require('../db/connection')

exports.fetchTopics = () => {
    return db.query(`
    SELECT * FROM topics;
    `).then((response) => {
        if (response.rows.length === 0) {
            return Promise.reject({status: 404, message: 'No topics found'})
        } else {
            return response.rows
        }
    })
}