import express from 'express';
import { createClient } from 'redis';
import dotenv from 'dotenv';
import cartRoutes from './routes/cart.routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3003;

app.use(express.json());

// Redis connection
export const redis = createClient({ url: process.env.REDIS_URL });
redis.connect()
  .then(() => console.log('✅ Redis connected'))
  .catch(err => console.error('❌ Redis error:', err));

app.use('/api/v1/cart', cartRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'healthy', service: 'cart-service' });
});

app.listen(PORT, () => {
  console.log(`🚀 Cart Service running on port ${PORT}`);
});

// Made with Bob
