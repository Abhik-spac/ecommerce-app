import express from 'express';
import { Pool } from 'pg';
import dotenv from 'dotenv';
import orderRoutes from './routes/order.routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3005;

app.use(express.json());

// PostgreSQL connection
export const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 5432,
  database: process.env.DB_NAME || 'ecommerce_orders',
  user: process.env.DB_USER || 'admin',
  password: process.env.DB_PASSWORD || 'password123',
});

pool.connect()
  .then(() => console.log('✅ PostgreSQL connected'))
  .catch(err => console.error('❌ PostgreSQL error:', err));

// Routes
app.use('/api/v1/orders', orderRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', service: 'order-service' });
});

app.listen(PORT, () => {
  console.log(`🚀 Order Service running on port ${PORT}`);
});

// Made with Bob
