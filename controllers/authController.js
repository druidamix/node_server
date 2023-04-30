import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import connection from '../config/db';
import { getUserFromDb } from './userController';

const { sign, verify, TokenExpiredError } = jwt;
/**
* Returns token as object
* @param {String} user Username
* @returns Returns object containing token and token_date
*/
export async function getUserSecret(user) {
  if (user) {
    const [rows] = await connection.query('SELECT token,token_date FROM users WHERE user=?', [user]);

    if (rows.affectedRows < 1) {
      return null;
    }

    return rows[0].token;
  }
  return null;
}

/**
 * Stores on db redundant token. Every time the app makes a request sends this token to verify
 * @param {String} user User
 * @returns Returns redudant token.
 */
export async function generateRedundantToken(user, pass) {
  const randomToken = crypto.randomBytes(250).toString('hex');

  const [result] = await connection.query('UPDATE users SET redundant_token = ? WHERE user = ? and password = ?', [randomToken, user, pass]);

  if (result.affectedRows < 1) {
    return null;
  }

  return randomToken;
}

/**
* Updates user token in database
* @param {String} user Username
* @returns {Promise<String>} Return new token
*/
export async function updateJwtSecretKey(user, redundant_token) {
  const token = crypto.randomBytes(2048).toString('hex');

  const [result] = await connection.query('UPDATE users SET token=?,token_date=now(),token_date_string=now(),lastupdate=now() WHERE user=? and redundant_token = ?', [token, user, redundant_token]);

  // if rows no affected returns null
  if (result.affectedRows < 1) {
    return null;
  }

  return token;
}

export async function authenticateTokenMiddelWare(req, res, next) {
  const token = req.headers['authorization'];
  const user = req.headers['user'];

  const secret = await getUserSecret(user);

  if (token == null) {
    return res.status(401).send('Unauthorized');
  }

  try {
    verify(token, secret);
    next();
  } catch (err) {
    if (err instanceof TokenExpiredError) {
      return res.sendStatus(401);
    }
    return res.sendStatus(500);
  }
  return null;
}

/**
 * @param {String} user User
 * @returns Signed token
 */
export async function generateJwtToken(user, redundant_token) {
  const jwtSecretKey = await updateJwtSecretKey(user, redundant_token);

  if (!jwtSecretKey) {
    throw Error('Unathorized');
  }

  const userDb = getUserFromDb(user);
  const data = {
    time: Date(),
    userId: userDb.id,
  };
  const token = sign(data, jwtSecretKey, {
    expiresIn: '15s',
    algorithm: 'HS256',
  });

  return token;
}
