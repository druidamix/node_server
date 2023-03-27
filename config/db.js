import mysql from 'mysql2/promise';

const pool = mysql.createPool({
    host: "127.0.0.1",
    user: "druida",
    database: "solenver",
    password: "1234"
})

export default pool;