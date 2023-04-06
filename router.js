import usersRoute from './routes/login.js';
import stationRouter from './routes/station.js'
import kpiRealtimeRouter from './routes/kpi.js'
import authRouter from './routes/auth.js';
import {authenticateTokenMiddelWare} from './controllers/authController.js'


const router = (app) => {
    app.use('/login', usersRoute);
    app.use('/stations',authenticateTokenMiddelWare, stationRouter);
    app.use('/kpi_realtime', authenticateTokenMiddelWare, kpiRealtimeRouter);
    app.use('/refresh_token', authRouter);
    app.all('*',(req,res)=>{
        const err = new Error(`Requested URL ${req.path} not found. Who are you?`);
        res.status(404).send(err.message);
    })
  
};

export default router;