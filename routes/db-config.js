const mysql = require('mysql2');
const dotenv = require('dotenv').config();

// Create a connection pool
const pool = mysql.createPool({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    connectionLimit: 10, // Adjust the number of connections as per your requirement
    queueLimit: 0
});

// Function to execute queries with async/await
const queryAsync = (sql, values) => {
    return new Promise((resolve, reject) => {
        pool.query(sql, values, (error, results) => {
            if (error) {
                reject(error);
            } else {
                resolve(results);
            }
        });
    });
};

module.exports = {
    pool, // Corrected variable name
    queryAsync,
};
