import connection from '../config/db.js';
import crypto from 'crypto';

/*
Stores a long random string on db and returns it.
*/
export async function storeNewUserToken(user){
  const token = crypto.randomBytes(42).toString('hex');
  try {
    //const user = getUserFromDb
    
    const [result] = await connection.query("UPDATE users SET token=?,token_date=now(),token_date_string=now(),lastupdate=now() WHERE user=?",[token,user]);
    
    if(result.affectedRows < 1){
      return null;
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
  
  try {
    
    var userDb = await _getUserTokenFromDb(user);
    
    //console.log('token: '+ userDb.token + ', date: '+ userDb.token_date);
    
    if(!user || !lru  || !userDb||userDb.token !== lru){
      //Invalid request
      
      return false;
    }

    const tokenDate = new Date(userDb.token_date);
    //console.log(Math.abs((dat.getTime()- new Date().getTime())/1000) );
    //If diff dates is greater than 3 seconds return invalidate
    if(Math.abs((tokenDate.getTime()- new Date().getTime())/1000) > 5){
      return false;
    }
    
  } catch (error) {
    console.log(error);
    return false;
  }
  
  //Valid request
  return true;
}

export async function changeUserPassOnDb(user, password) {
  
  const [rows] = await connection.query("UPDATE users SET password=?,lastupdate=now() where user=?", [password, user]);
  
  if (rows.affectedRows < 1) {
    return false;
  }
  
  // await pool.query("UPDATE users SET first_login =?,lastupdate=now() where user=?",[1,user]);
  return true;
}

export  async function getUserFromDb(user, password) {
  
  const [rows,fields] = await connection.query("SELECT * FROM users where user = ? and password = ?", [user, password]);
  console.log('--entries : '+ rows);

  if(rows.affectedRows <1){
    return null;
  }

  return rows[0];
}


async function _getUserTokenFromDb(user){
  
  try {
    const [rows] = await connection.query("SELECT token,token_date FROM users WHERE user=?",[user]);
    
    if(rows.affectedRows < 1){
      return null;
    }

    return rows[0];
  } catch (error) {
    console.log('--error:' + error);
    throw error;
  }
}
