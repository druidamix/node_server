import express from 'express';
import { getUsersFromDb } from '../controllers/userController';

const router = express.Router();

router.get('/', async (_, res) => {
  try {
    const users = await getUsersFromDb();
    res.status(200).send(users);
  } catch (error) {
    res.status(500).send('Internal Error');
  }
});

export default router;
