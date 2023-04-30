import express from 'express';
import axios from 'axios';
import { url_login } from '../config/constants';
import { getUserFromDb, updateUserPasword } from '../controllers/userController';
import { authenticateTokenMiddelWare, generateRedundantToken } from '../controllers/authController';

const router = express.Router();

// login
router.post('/', async (req, res) => {
  const { user, pass } = req.headers;

  const userDb = await getUserFromDb(user, pass);

  if (userDb != null) {
    const token = await generateRedundantToken(user, pass);
    // Check if user ever logged.
    if (userDb.first_login === 0) {
      // reporting to create new password
      res.status(206).json({ redundant_token: token });
      return;
    }

    // user logged correctly. Returing a redundant token
    res.status(200).send({ redundant_token: token });
  } else {
    res.status(404).send('Not found');
  }
});

// update password
router.post('/update_register', authenticateTokenMiddelWare, async (req, res) => {
  const { user, pass } = req.headers;

  updateUserPasword(user, pass).then((result) => {
    if (result === true) {
      res.status(200).send('Register updated');
      return;
    }
    res.status(205).send('Not found');
  });
});

export const getLoginToken = async () => {
  const result = await axios.post(url_login, {
    userName: 'marc_api',
    systemCode: 'comodore.9',
  }, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (platform; rv:geckoversion) Gecko/geckotrail Firefox/firefoxversion',
    },
  });

  return result;
};

export default router;
