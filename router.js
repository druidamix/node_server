import usersRoute from './routes/login.js';
import stationRouter from './routes/station.js'
import kpiRealtimeRouter from './routes/kpi.js'
import tokenRouter from './routes/token.js';
import {authenticateToken} from './controllers/authController.js'


const router = (app) => {
    app.use('/login',authenticateToken, usersRoute);
    app.use('/stations',authenticateToken, stationRouter);
    app.use('/kpi_realtime', authenticateToken, kpiRealtimeRouter);
    app.use('/s_f826b683', tokenRouter);
    app.all('*',(req,res)=>{
        const err = new Error(`Requested URL ${req.path} not found. Who are you?`);
        res.status(404).send(err.message);
    })
  
};

export default router;