import connection from '../config/db.js';
import { differenceInSeconds} from 'date-fns';
import {updateUserSecret,getUserSecret} from './authController.js'




/**
 * Validates if token sent by last request is equal to saven in DB 
 * @param {String} user  user
 * @param {String} token  Token
 * @returns {Boolean} Returns true if token is equal
 */
export async function validateRequest(user,token){
  
  try {
    
    var userDb = await getUserSecret(user);
    
    //if empties and token is different than sent by request return false (invalid)
    if( !userDb||userDb.token !== token){
      //Invalid request
      return false;
    }


    const tokenDate = userDb.token_date;
    const currentDate = new Date();

  
    //console.log(differenceInSeconds(tokenDate,currentDate));

    //If diff dates is greater than 3 seconds return invalidate
    if(Math.abs(differenceInSeconds(tokenDate,currentDate)) > 5){
      return false;
    }
    
  } catch (error) {
    console.log(error);
    return false;
  }
  
  //Valid request
  return true;
}

/**
 * Updates user password along first_login 
 * @param {String} user Username
 * @param {String} password Password
 * @returns {Boolean} Returns true if updated correctly
 */
export async function updateUserPasword(user, password) {
  
  const [rows] = await connection.query("UPDATE users SET password=?,lastupdate=now(),first_login =? where user=?", [password, 1,user]);
  
  if (rows.affectedRows < 1) {
    return false;
  }
  
  return true;
}

/**
 * Get user from DB
 * @param  {String} user Username
 * @param  {String} password  Password
 * @return {Object?}    Returns user or null if not found
 */
export async function getUserFromDb(user, password) {
  
  const [rows] = await connection.query("SELECT * FROM users where user = ? and password = ?", [user, password]);

  if(rows.affectedRows <1){
    return null;
  }

  return rows[0];
}


