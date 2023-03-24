import usersRoute from './routes/login.js';
import stationRouter from './routes/station.js'
import kpiRealtimeRouter from './routes/kpi.js'
import keyRouter from './routes/key.js';

//* Here I defined the first endpoint
const router = (app) => {
    app.use('/login', usersRoute);
    app.use('/stations',stationRouter);
    app.use('/kpi_realtime', kpiRealtimeRouter);
    app.use('/2c70e12b7a0646f92279f427c7b38e7334d8e5389cff167a1dc30e73f826b683', keyRouter);
};

export default router;