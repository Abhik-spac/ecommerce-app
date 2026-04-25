import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './swagger';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Swagger documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Routes
app.use('/api/auth', authRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', service: 'auth-service' });
});

// MongoDB connection
mongoose
  .connect(process.env.MONGODB_URI || 'mongodb://admin:admin123@localhost:27017/auth-db?authSource=admin')
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`Auth service running on port ${PORT}`);
      console.log(`Swagger docs available at http://localhost:${PORT}/api-docs`);
    });
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  });

export default app;

// Made with Bob
