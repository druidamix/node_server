import connection from '../config/db.js';
import crypto from 'crypto';

/*
Stores a long random string on db and returns it.
*/
export async function storeNewUserToken(user){
  const token = crypto.randomBytes(42).toString('hex');
  try {
   
    const [result] = await connection.query("UPDATE users SET token=?,token_date=now(),token_date_string=now(),lastupdate=now() WHERE user=?",[token,user]);
  
    if(result.affectedRows >0){
      return token;
    }
    
    return token;
  } catch (error) {
    console.log(error);
    throw error;
  }
}


/*
Checks token user against request token
*/
export async function validateRequest(user,lru){
  
  const [token,token_date ]= await _getUserTokenFromDb(user);
  
  if(!user || !lru  || !token||token !== lru){
    //Invalid request
    
    return false;
  }

  console.log(token_date);

  const dat = new Date(token_date);
  console.log(Math.abs((dat.getTime()- new Date().getTime())/1000) );
  //If diff dates is greater than 3 seconds return invalidate
  if(Math.abs((dat.getTime()- new Date().getTime())/1000) > 5){
    return false;
  }

  //Valid request
  return true;
}

export async function changePassOnDb(user, password) {
  
  const [rows] = await connection.query("UPDATE users SET password=?,lastupdate=now() where user=?", [password, user]);
  
  if (rows.affectedRows < 1) {
    return false;
  }
  
  await pool.query("UPDATE users SET first_login =?,lastupdate=now() where user=?",[1,user]);
  
  return true;
}

export  async function getUserFromDb(user, password) {
  
  const [rows,fields] = await connection.query("SELECT * FROM users where user = ? and password = ?", [user, password]);
  
  return rows;
}


async function _getUserTokenFromDb(user){
  
  try {
    const [rows] = await connection.query("SELECT token,token_date FROM users WHERE user=?",[user]);
    
    if(rows.affectedRows < 1){
      return undefined;
    }
    //console.log(rows.at(0));
    return [rows[0].token,rows[0].token_date];
  } catch (error) {
    return undefined;
  }
}
