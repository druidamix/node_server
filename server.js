import express from 'express';
import bodyparser from 'body-parser';
import router from './router.js';;



const app = express();
const PORT = 3333;

app.use(bodyparser.json());


router(app);


app.listen(PORT,'0.0.0.0');