import express from 'express';
import compression from 'compression';
import helmet from 'helmet';
import cors from 'cors';
import passport from '~/config/passport';
import routes from '~/routes/v1';
import error from '~/middlewares/error';
import rateLimiter from '~/middlewares/rateLimiter';
import config from '~/config/config';
import morgan from '~/config/morgan';

const app = express();

if (config.NODE_ENV !== 'test') {
	app.use(morgan);
}

app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(compression());
app.use(cors());
app.use(rateLimiter);
app.use(passport.initialize());
app.use(express.static('public'));

app.use('/api/v1', routes); // 👈 support тоже теперь внутри v1

app.use(error.converter);
app.use(error.notFound);
app.use(error.handler);

export default app;
