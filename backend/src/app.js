import express from 'express';
import cors from 'cors';
import helmet from 'helmet'; // ✅ added Helmet import

import authRoutes from './routes/auth.routes.js';
import dashboardRoutes from './routes/dashboard.routes.js';
import orderRoutes from './routes/order.routes.js';
import mainStoresRoutes from './routes/mainStores.routes.js';
import storeManagerRoutes from './routes/storeManager.routes.js';
import driverRoutes from './routes/driver.routes.js';
import reportRoutes from './routes/report.routes.js';
import locationRoutes from './routes/location.routes.js';
import trainScheduleRoutes from './routes/trainSchedule.routes.js';
import usersRoutes from './routes/users.routes.js';
import alertRoutes from './routes/alert.routes.js';
import errorHandler from '../middleware/errorHandler.js';

const app = express();

app.use(cors());
app.use(helmet()); // ✅ added Helmet middleware
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/main-stores', mainStoresRoutes);
app.use('/api/store-manager', storeManagerRoutes);
app.use('/api/driver', driverRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/location', locationRoutes);
app.use('/api/train-schedules', trainScheduleRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/alerts', alertRoutes);

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

// Error handler should be last
app.use(errorHandler);

export default app;
