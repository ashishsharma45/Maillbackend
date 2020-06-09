var Pg = require('pg').Pool; 
const pool = new Pg({
    user: 'me',
    host: 'localhost',
    database: 'databaseName',
    password: '',
    port: 5432
})

module.exports = pool;