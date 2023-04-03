import connection from '../config/db.js'
import crypto from 'crypto'
import jwt from 'jsonwebtoken'

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
    console.log('--updateseecret')
    console.log(error);
    throw error;
  }
}


export async function authenticateToken(req, res, next) {
  const token = req.headers['authorization']
  const user = req.body.user;

  
  const secret = await getUserSecret(user)
  
  if (token == null){ 
    console.log('unauthorized');
    return res.status(401).send('Unauthorized');
  }
  jwt.verify(token, secret,function (err, user ){
    
    
    if (err){ 
      console.log(err);
      return res.sendStatus(403)
    }
    req.user = user
    
    next()
  })
}


export async function generateToken(user){

  let jwtSecretKey = await updateUserSecret(user);
  
  let data = {
    time: Date(),
    userId: 12,
    expiresIn: 60*3
  }
  
  const token = jwt.sign(data, jwtSecretKey);

  
  return token
  
}

