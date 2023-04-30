import express from 'express';
import bodyparser from 'body-parser';
import router from './router';

const app = express();
const PORT = 3333;

// this is a trivial implementation
app.use((_req, _res, next) => {
  bodyparser.json()((_, res, err) => {
    if (err) {
      return res.sendStatus(400); // Bad request
    }
    next();
    return null;
  });
});

app.use((err, res, next) => {
  // ⚙️ our function to catch errors from body-parser
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    // do your own thing here 👍
    res.status(400).send('Bad request');
  } else {
    next();
  }
});

router(app);

app.listen(PORT, '0.0.0.0');
