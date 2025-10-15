import express from 'express';
import cors from 'cors';
import dashboardRoutes from './routes/dashboard.routes.js';
import orderRoutes from './routes/order.routes.js';
import authRoutes from './routes/auth.routes.js';
import errorHandler from '../middleware/errorHandler.js';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/orders', orderRoutes);

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

// Error handler should be last
app.use(errorHandler);

export default app;