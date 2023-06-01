# News API

This repo serves a basic API for a news site. It allows the user to access and update articles, and post or delete comments amongst other things.

Through the API, you can set up and seed a database with information on articles, topics, users and comments, then use SQL queries to access the information.

The hosted version of the API as well as the endpoints available can be viewed [here](https://be-nc-news-noc1.onrender.com/api).

## Getting Started
You can fork this repo or clone as follows:
```bash
git clone https://github.com/saimakhanom/sk-be-nc-news.git

cd sk-be-nc-news
```
### Install dependencies
To get all the dependencies needed to use this project, run:
```bash
npm i
```

### Minimum requirements
- Node: v19.7.0
- Postgres: v14.7.0


## Set-up
We have two databases in this project. One for real looking dev data and another for simpler test data.

To run this project locally, you will need test and developement .env files. These .env files are .gitignored, so you will need to create them yourself: 
- .env.test
- .env.development    

Into each file, add `PGDATABASE=<database_name_here>`, with the correct database name for that environment (see /db/setup.sql for the database names). 

You will then need to create the databases as follows:
```bash
npm run setup-dbs
```
To seed the development database, run:
```bash
npm run seed
```

The test database will automatically re-seed before each individual test.

## Testing
To test all existing endpoints for the app, run the follwoing command:
```bash
npm t
```
Each individual test is set up to test the accepted HTTP methods for each endpoint. The tests also cover **successful responses** and **error-handling**. They will also test that the body of the JSON response object is in the correct format, if applicable.

## Tech Stack

This project has been built with the following:
- Node.js: JavaScript runtime
- Express: Web framework for Node.js
- PostgreSQL - Relational database system 
- Node-Postgres - Node.js modules for interfacing with a PostgreSQL database
- pg-format - Node.js implementation of PostgreSQL format() to safely create dynamic SQL queries

### Testing
- Jest - JavaScript testing framework
- Supertest - HTTP assertion library

## Author
Saima Khanom 2023