import express from 'express';
import bodyparser from 'body-parser';
import usersRoute, { getLoginToken } from './routes/login.js';
import stationRouter from './routes/station.js'
import { url_login } from './config/constants.js';
import fetch from 'node-fetch'
import axios from 'axios';


const app = express();
const PORT = 3333;

app.use(bodyparser.json());

app.use('/login',usersRoute)

app.use('/stations',stationRouter);



app.listen(PORT,'0.0.0.0');