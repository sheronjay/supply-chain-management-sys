import express from 'express';
import cors from 'cors';
import dashboardRoutes from './routes/dashboard.routes.js';
import orderRoutes from './routes/order.routes.js';
import mainStoresRoutes from './routes/mainStores.routes.js';
import errorHandler from '../middleware/errorHandler.js';
import reportRouter from './routes/report.js';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/dashboard', dashboardRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/main-stores', mainStoresRoutes);
app.use('/api/report', reportRouter)

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

// Error handler should be last
app.use(errorHandler);

export default app;