import mysql from 'mysql2/promise';

const pool = mysql.createPool({
    host: "localhost",
    user: "druida",
    database: "solenver",
    password: "1234"
})

export default pool;