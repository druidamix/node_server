import connection from '../config/db.js';
import { differenceInSeconds} from 'date-fns';
import {updateUserSecret,getUserSecret} from './authController.js'




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


