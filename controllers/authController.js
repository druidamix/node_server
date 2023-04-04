import connection from '../config/db.js'
import crypto from 'crypto'
import jwt from 'jsonwebtoken'
const { sign, verify,TokenExpiredError } = jwt;
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
    
    return rows[0].token;
  } catch (error) {
    console.log('--error:' + error);
    throw error;
  }
}

/**
 * Stores on db bearer token
 * @param {String} user User
 * @returns Returns bearer token.
 */
export async function generateLoginToken(user){
  const token =  crypto.randomBytes(250).toString('hex');
  
  try {
      const [result ] = await connection.query("UPDATE users SET bearer_token = ? WHERE user = ?",[token,user]);
      return token;
  
  } catch (error) {
    throw error;
  }
}

/**
* Updates user token in database
* @param {String} user Username
* @returns {Promise<String>} Return new token
*/
export async function updateUserSecret(user,bearer){
  const token =  crypto.randomBytes(2048).toString('hex')
  
  try {
    
    const [result] = await connection.query("UPDATE users SET token=?,token_date=now(),token_date_string=now(),lastupdate=now() WHERE user=? and bearer_token = ?",[token,user, bearer]);
    
    //if rows no affected returns null
    if(result.affectedRows < 1){
      console.log('0 affected rows');
      return null;
    }
    
    return token;
  } catch (error) {
    console.log('--updateseecret')
    console.log(error);
    throw error;
  }
}


export async function authenticateTokenMiddelWare(req, res, next) {
  const token = req.headers['authorization']
  const user = req.body.user;
  
  const secret = await getUserSecret(user)
 
  if (token == null){ 
    console.log('unauthorized');
    return res.status(401).send('Unauthorized');
  }
  
  try {
    
    verify(token, secret);

    next();
  } catch (err) {
    console.log(err);
    if (err instanceof TokenExpiredError) {
      return res.sendStatus(401);
    }
    return res.sendStatus(500);
  } 
}

/**
 * 
 * @param {String} user User
 * @returns Signed token
 */
export async function generateToken(user,bearer){

  let jwtSecretKey = await updateUserSecret(user,bearer);

  let data = {
    time: Date(),
    userId: 12,
  }  
  
  const token = sign(data, jwtSecretKey,{expiresIn: '15s'});
  
  return token
}

