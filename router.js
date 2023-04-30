import loginRouter from './routes/login';
import stationRouter from './routes/station';
import kpiRealtimeRouter from './routes/kpi';
import authRouter from './routes/auth';
import userRouter from './routes/users';

import { authenticateTokenMiddelWare } from './controllers/authController';

const router = (app) => {
  app.use('/login', loginRouter);
  app.use('/users', userRouter);
  app.use('/stations', authenticateTokenMiddelWare, stationRouter);
  app.use('/kpi_realtime', authenticateTokenMiddelWare, kpiRealtimeRouter);
  app.use('/refresh_token', authRouter);

  app.all('*', (req, res) => {
    const err = new Error(`Requested URL ${req.path} not found. Who are you?`);

    res.status(404).send(err.message);
  });
};

export default router;
