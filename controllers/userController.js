import connection from '../config/db.js';
import crypto from 'crypto';

/*
  Stores a long random string on db and returns it.
*/
export async function storeNewUserToken(user){
  const token = crypto.randomBytes(42).toString('hex');
  const [result] = await connection.query("UPDATE users SET token=? WHERE user=?",[token,user]);
  
  return token;
}

/*

*/
export async function getUserTokenFromDb(user){
  
  const [rows] = await connection.query("SELECT token FROM users WHERE user=?",[user]);

  if(rows.affectedRows < 1){
    return undefined;
  }
  //console.log(rows.at(0));
  return rows[0].token;
}

export async function validateRequest(user,lru){

   
    const token = await getUserTokenFromDb(user);
  
    
    if(!user || !lru  || !token||token !== lru){
        //Invalid request
       
        return false;
    }
    
    //Valid request
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


    const [rows,fields] = await connection.query("SELECT * FROM users where user = ? and password = ?", [user, password]);

    return rows;
}