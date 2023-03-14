import express from 'express';
import bodyparser from 'body-parser';
import usersRoute, { getLoginToken } from './routes/login.js';
import stationRouter from './routes/station.js'
import kpiRealtimeRouter from './routes/kpi.js'


const app = express();
const PORT = 3333;

app.use(bodyparser.json());

app.use('/login',usersRoute)

app.use('/stations',stationRouter);
app.use('/kpi_realtime', kpiRealtimeRouter);


app.listen(PORT,'0.0.0.0');