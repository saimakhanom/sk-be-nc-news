# Northcoders News API

## Set-up
We have two databases in this project. One for real looking dev data and another for simpler test data.

To run this project locally, you will need to create two .env files: .env.test and .env.development. Into each, add PGDATABASE=<database_name_here>, with the correct database name for that environment (see /db/setup.sql for the database names). Double check that these .env files are .gitignored.