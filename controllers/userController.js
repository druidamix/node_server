import connection from '../config/db.js';
import crypto from 'crypto';

/*
  Stores a long random string on db and returns it.
*/
export async function storeNewUserHash(user){
  const randomHash = crypto.randomBytes(42).toString('hex');
  const [result] = await connection.query("UPDATE users SET lasthash=? WHERE user=?",[randomHash,user]);
  
  return randomHash;
}

export async function getUserHashFromDb(user){
  
  const [rows] = await connection.query("SELECT lastHash FROM users WHERE user=?",[user]);

  if(rows.affectedRows < 1){
    return false;
  }
  //console.log(rows.at(0));
  return rows;
}

export async function validateUser(user,lru){

   
    const dbHash = await getUserHashFromDb(user);
  
    
    if(!user || !lru  || dbHash[0].lastHash !== lru){
      console.log('--invalid');
       
        return false;
    }
    console.log('--VAlid');
    return true;

}

export async function changePassword(user, password) {

  const [rows] = await connection.query("UPDATE users SET password=? where user=?", [password, user]);
 
  if (rows.affectedRows < 1) {
      return false;
  }

  await pool.query("UPDATE users SET first_login =? where user=?",[1,user]);

  return true;
}

export  async function getUser(user, password) {


    console.log(user + ' ' + password);
    const [rows,fields] = await connection.query("SELECT * FROM users where user = ? and password = ?", [user, password]);

    
    return rows;
}
