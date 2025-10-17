import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.routes.js';
import dashboardRoutes from './routes/dashboard.routes.js';
import orderRoutes from './routes/order.routes.js';
import mainStoresRoutes from './routes/mainStores.routes.js';
import storeManagerRoutes from './routes/storeManager.routes.js';
import driverRoutes from './routes/driver.routes.js';
import reportRoutes from './routes/report.routes.js';
import errorHandler from '../middleware/errorHandler.js';
import reportRouter from './routes/report.js';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/main-stores', mainStoresRoutes);

app.use('/api/report', reportRouter)

app.use('/api/store-manager', storeManagerRoutes);
app.use('/api/driver', driverRoutes);
app.use('/api/reports', reportRoutes);

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

// Error handler should be last
app.use(errorHandler);

export default app;