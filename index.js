import bodyParser from 'body-parser';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import routes from './routes';
import config from './config';

const app = express();

// parse body params and attache them to req.body
app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));

// secure apps by setting various HTTP headers
app.use(helmet());

// enable CORS - Cross Origin Resource Sharing
app.use(cors());

app.get('/oauth/dialog/authorize', routes.oauth2.authorization);
app.post('/oauth/dialog/authorize/decision', routes.oauth2.decision);
app.post('/oauth/token', routes.oauth2.token);

app.get('/oauth/userinfo', routes.user.info);
app.get('/oauth/clientinfo', routes.client.info);

app.listen(process.env.PORT || 6000);

export default app;