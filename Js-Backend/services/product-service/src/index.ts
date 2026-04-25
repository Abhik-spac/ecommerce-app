import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import productRoutes from './routes/product.routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3002;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/products', productRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', service: 'product-service' });
});

// MongoDB connection
mongoose
  .connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/product-db')
  .then(() => {
    console.log('✅ MongoDB connected');
    app.listen(PORT, () => {
      console.log(`🚀 Product Service running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  });

export default app;

// Made with Bob
