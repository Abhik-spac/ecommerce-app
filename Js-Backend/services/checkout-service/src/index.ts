import express from 'express';
import dotenv from 'dotenv';
import checkoutRoutes from './routes/checkout.routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3004;

app.use(express.json());

// Routes
app.use('/api/v1/checkout', checkoutRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', service: 'checkout-service' });
});

app.listen(PORT, () => {
  console.log(`🚀 Checkout Service running on port ${PORT}`);
});

// Made with Bob
