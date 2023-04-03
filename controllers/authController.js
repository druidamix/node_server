import connection from '../config/db.js'
import crypto from 'crypto'


/**
 * Returns token as object
 * @param {String} user Username
 * @returns Returns object containing token and token_date
 */
export async function getUserSecret(user){
  
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
  

/**
 * Updates user token in database
 * @param {String} user Username
 * @returns {String} Return new token
 */
export async function updateUserSecret(user){
    const token =  crypto.randomBytes(2048).toString('hex')

    try {
      
      const [result] = await connection.query("UPDATE users SET token=?,token_date=now(),token_date_string=now(),lastupdate=now() WHERE user=?",[token,user]);
      
      //if rows no affected returns null
      if(result.affectedRows < 1){
        console.log('0 affected rows');
        return null;
      }

      
      return token;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }