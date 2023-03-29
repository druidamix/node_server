import express from 'express';
import bodyparser from 'body-parser';
import router from './router.js';;



const app = express();
const PORT = 3333;

// this is a trivial implementation
app.use((req, res, next) => {
    bodyparser.json()(req, res, err => {
        console.log(res);
        if (err) {
            console.error(err);
            return res.sendStatus(400); // Bad request
        }

        next();
    });
});

router(app);

app.listen(PORT,'0.0.0.0');