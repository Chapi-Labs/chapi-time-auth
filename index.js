import bodyParser from 'body-parser';
import cors from 'cors';
import express from 'express';
import session from 'express-session';
import helmet from 'helmet';
import passport from 'passport';
import routes from './routes';
import config from './config';
import auth from './auth/auth';

const app = express();

// parse body params and attache them to req.body
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(passport.initialize());
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));
// secure apps by setting various HTTP headers
app.use(helmet());

// enable CORS - Cross Origin Resource Sharing
app.use(cors());
app.post('/oauth/token', routes.oauth2.token);
app.get('/oauth/userinfo', routes.user.info);
app.get('/oauth/clientinfo', routes.client.info);


app.listen(process.env.PORT || 6000);

export default app;