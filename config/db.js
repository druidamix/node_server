import mysql from 'mysql2/promise';

const pool = mysql.createPool({
    host: "localhost",
    user: "root",
    database: "solenver",
    password: "comodore.9"
})


export async function getUser(user, password) {
    console.log(user + ' ' + password);
    const [rows,fields] = await pool.query("SELECT * FROM users where user = ? and password = ?", [user, password]);

    
    return rows;
}


export async function changePassword(user, password) {
    console.log(user);
    console.log(password);
    const [rows] = await pool.query("UPDATE users SET password=? where user=?", [password, user]);
    console.log(rows);
    if (rows.affectedRows < 1) {
        return false;
    }

    await pool.query("UPDATE users SET first_login =? where user=?",[1,user]);

    return true;
}

export default pool;