import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import mongoSanitize from 'express-mongo-sanitize';
import swaggerUi from 'swagger-ui-express';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';

import { env } from './config/env.js';
import apiRoutes from './routes/index.js';
import { redirect } from './controllers/redirect.controller.js';
import { notFoundHandler, errorHandler } from './middlewares/error.middleware.js';
import { globalLimiter, redirectLimiter } from './middlewares/rateLimiter.middleware.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const openapiSpec = JSON.parse(readFileSync(path.join(__dirname, 'docs/openapi.json'), 'utf-8'));

const app = express();

// Render terminates TLS at its edge proxy — trust the first hop so
// req.secure / rate-limit IP detection behaves correctly.
app.set('trust proxy', 1);

app.use(
  helmet({
    contentSecurityPolicy: false, // API-only service; the SPA sets its own CSP
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  })
);
app.use(compression());
app.use(
  cors({
    origin: [env.clientUrl],
    credentials: true,
  })
);
app.use(express.json({ limit: '100kb' }));
app.use(express.urlencoded({ extended: true, limit: '100kb' }));
app.use(cookieParser());
app.use(mongoSanitize());
if (env.nodeEnv !== 'test') {
  app.use(morgan(env.nodeEnv === 'production' ? 'combined' : 'dev'));
}
app.use(globalLimiter);

app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(openapiSpec, { customSiteTitle: 'SnapLink API Docs' }));
app.use('/api', apiRoutes);

app.get('/', (req, res) => {
  res.json({ success: true, message: 'SnapLink API', data: { docs: '/api/docs' } });
});

// Root-level short link redirect, e.g. https://snaplink.onrender.com/aBc123
// Kept below /api and / so it never shadows real API or root routes.
app.get('/:code', redirectLimiter, redirect);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
