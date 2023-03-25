import usersRoute from './routes/login.js';
import stationRouter from './routes/station.js'
import kpiRealtimeRouter from './routes/kpi.js'
import keyRouter from './routes/token.js';

//* Here I defined the first endpoint
const router = (app) => {
    app.use('/login', usersRoute);
    app.use('/stations',stationRouter);
    app.use('/kpi_realtime', kpiRealtimeRouter);
    app.use('/s_f826b683', keyRouter);
    app.all('*',(req,res)=>{
        const err = new Error(`Requested URL ${req.path} not found`);
        res.status(404).send(err.message);
    })
  
};

export default router;