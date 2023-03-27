import connection from '../config/db.js';
import crypto from 'crypto';
import dayjs from 'dayjs';


/*
  Returs token from user
*/
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

/*
  Updates user row with random bytes
*/
export async function updateUserToken(user){
  const token = crypto.randomBytes(42).toString('hex');
  try {
    
    const [result] = await connection.query("UPDATE users SET token=?,token_date=now(),token_date_string=now(),lastupdate=now() WHERE user=?",[token,user]);
    
    //if rows no affected returns null
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
    
    //if empties and token is different than sent by request return false (invalid)
    if( !userDb||userDb.token !== lru){
      //Invalid request
      return false;
    }

    const tokenDate = dayjs(userDb.token_date);//new Date(userDb.token_date);
    const currentDate = dayjs();
    //console.log(tokenDate);
    //console.log('diff- :'+ currentDate.diff(tokenDate,'second'));

  
    //console.log(Math.abs((dat.getTime()- new Date().getTime())/1000) );
    //If diff dates is greater than 3 seconds return invalidate
    if(Math.abs(currentDate.diff(tokenDate,'second')) > 5){
      return false;
    }
    
  } catch (error) {
    console.log(error);
    return false;
  }
  
  //Valid request
  return true;
}

export async function updateUserPasword(user, password) {
  
  const [rows] = await connection.query("UPDATE users SET password=?,lastupdate=now(),first_login =? where user=?", [password, 1,user]);
  
  if (rows.affectedRows < 1) {
    return false;
  }
  

  return true;
}

/*
  Gets user from db
*/
export async function getUserFromDb(user, password) {
  
  const [rows,fields] = await connection.query("SELECT * FROM users where user = ? and password = ?", [user, password]);

  if(rows.affectedRows <1){
    return null;
  }

  return rows[0];
}


