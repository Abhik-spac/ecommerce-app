/**
 * API Gateway - Entry point for all microservices
 * Standalone version without external dependencies
 */

import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { createProxyMiddleware } from 'http-proxy-middleware';
import rateLimit from 'express-rate-limit';
import jwt from 'jsonwebtoken';

// Load environment variables
dotenv.config();

// Create Express app
const app: Application = express();
const PORT = process.env.PORT!;

// Simple logger (instead of importing from common)
const log = {
  info: (message: string, meta?: any) => console.log(`[INFO] ${message}`, meta || ''),
  error: (message: string, meta?: any) => console.error(`[ERROR] ${message}`, meta || ''),
  warn: (message: string, meta?: any) => console.warn(`[WARN] ${message}`, meta || ''),
  debug: (message: string, meta?: any) => console.debug(`[DEBUG] ${message}`, meta || ''),
};

// Middleware
app.use(helmet()); // Security headers
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS!.split(','),
  credentials: true,
  optionsSuccessStatus: 200,
}));
app.use(compression()); // Response compression
// Don't parse body for API routes - let the proxy handle it
app.use((req, res, next) => {
  if (req.path.startsWith('/api/v1/')) {
    return next();
  }
  express.json()(req, res, next);
});
app.use((req, res, next) => {
  if (req.path.startsWith('/api/v1/')) {
    return next();
  }
  express.urlencoded({ extended: true })(req, res, next);
});
app.use(morgan('combined')); // HTTP logging

// Request logging middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    log.info('Request completed', {
      method: req.method,
      path: req.path,
      statusCode: res.statusCode,
      duration: `${duration}ms`,
      ip: req.ip,
    });
  });
  next();
});

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/', limiter);

// JWT verification middleware - extracts userId/guestId from token and adds to headers
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const jwtMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7);
    
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as any;
      
      // Check if this is a guest user token
      if (decoded.type === 'guest' && decoded.guestId) {
        req.headers['x-guest-id'] = decoded.guestId;
        log.debug(`JWT verified for guest: ${decoded.guestId}`);
      } else {
        // Regular user token
        const userId = decoded.userId || decoded.id;
        if (userId) {
          req.headers['x-user-id'] = userId;
          log.debug(`JWT verified for user: ${userId}`);
        }
      }
    } catch (error) {
      log.warn('Invalid JWT token - token may be expired or signed with different secret', { error: (error as Error).message });
      // Try to decode without verification to extract user info (for development)
      try {
        const decoded = jwt.decode(token) as any;
        if (decoded) {
          if (decoded.type === 'guest' && decoded.guestId) {
            req.headers['x-guest-id'] = decoded.guestId;
            log.debug(`Using unverified guest token: ${decoded.guestId} (DEVELOPMENT ONLY)`);
          } else {
            const userId = decoded.userId || decoded.id;
            if (userId) {
              req.headers['x-user-id'] = userId;
              log.debug(`Using unverified user token: ${userId} (DEVELOPMENT ONLY)`);
            }
          }
        }
      } catch (decodeError) {
        log.error('Failed to decode JWT token', { error: (decodeError as Error).message });
      }
    }
  }
  
  next();
};

// Apply JWT middleware to all API routes
app.use('/api/', jwtMiddleware);

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'healthy',
    service: 'api-gateway',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// API Documentation placeholder
app.get('/api-docs', (req: Request, res: Response) => {
  res.json({
    message: 'API Documentation',
    note: 'Swagger UI will be available here once configured',
    endpoints: {
      health: 'GET /health',
      auth: 'POST /api/v1/auth/*',
      products: 'GET /api/v1/products/*',
      cart: 'GET /api/v1/cart/*',
      checkout: 'POST /api/v1/checkout/*',
      orders: 'GET /api/v1/orders/*',
      users: 'GET /api/v1/users/*',
    }
  });
});

// Service URLs from environment variables
const SERVICES = {
  AUTH: process.env.AUTH_SERVICE_URL!,
  PRODUCT: process.env.PRODUCT_SERVICE_URL!,
  CART: process.env.CART_SERVICE_URL!,
  CHECKOUT: process.env.CHECKOUT_SERVICE_URL!,
  ORDER: process.env.ORDER_SERVICE_URL!,
  USER: process.env.USER_SERVICE_URL!,
};

// Proxy configuration
const proxyOptions = {
  changeOrigin: true,
  logLevel: 'debug' as const,
  timeout: 10000, // 10 second timeout
  proxyTimeout: 10000,
  onProxyReq: (proxyReq: any, req: any) => {
    // Forward the x-user-id header if it exists
    if (req.headers['x-user-id']) {
      proxyReq.setHeader('x-user-id', req.headers['x-user-id']);
      log.debug(`Forwarding x-user-id: ${req.headers['x-user-id']}`);
    }
    // Forward the x-guest-id header if it exists
    if (req.headers['x-guest-id']) {
      proxyReq.setHeader('x-guest-id', req.headers['x-guest-id']);
      log.debug(`Forwarding x-guest-id: ${req.headers['x-guest-id']}`);
    }
    log.debug(`Proxying ${req.method} ${req.path} to ${proxyReq.path}`);
  },
  onProxyRes: (proxyRes: any, req: any, res: any) => {
    log.debug(`Received response from ${req.path}: ${proxyRes.statusCode}`);
  },
  onError: (err: Error, req: any, res: any) => {
    log.error('Proxy error:', err);
    if (!res.headersSent) {
      res.status(503).json({
        success: false,
        error: {
          code: 'SERVICE_UNAVAILABLE',
          message: 'Service temporarily unavailable',
        },
        timestamp: new Date().toISOString(),
      });
    }
  },
};

// Route proxies to microservices
app.use(
  '/api/v1/auth',
  createProxyMiddleware({
    target: SERVICES.AUTH,
    ...proxyOptions,
    pathRewrite: { '^/api/v1/auth': '/api/v1/auth' },
  })
);

app.use(
  '/api/v1/products',
  createProxyMiddleware({
    target: SERVICES.PRODUCT,
    ...proxyOptions,
    pathRewrite: { '^/api/v1/products': '/api/v1/products' },
  })
);

app.use(
  '/api/v1/categories',
  createProxyMiddleware({
    target: SERVICES.PRODUCT,
    ...proxyOptions,
    pathRewrite: { '^/api/v1/categories': '/api/v1/categories' },
  })
);

app.use(
  '/api/v1/cart',
  createProxyMiddleware({
    target: SERVICES.CART,
    ...proxyOptions,
    pathRewrite: { '^/api/v1/cart': '/api/v1/cart' },
  })
);

app.use(
  '/api/v1/checkout',
  createProxyMiddleware({
    target: SERVICES.CHECKOUT,
    ...proxyOptions,
    pathRewrite: { '^/api/v1/checkout': '/api/v1/checkout' },
  })
);

app.use(
  '/api/v1/orders',
  createProxyMiddleware({
    target: SERVICES.ORDER,
    ...proxyOptions,
    pathRewrite: { '^/api/v1/orders': '/api/v1/orders' },
  })
);

app.use(
  '/api/v1/users',
  createProxyMiddleware({
    target: SERVICES.USER,
    ...proxyOptions,
    pathRewrite: { '^/api/v1/users': '/api/v1/users' },
  })
);

// Welcome route
app.get('/', (req: Request, res: Response) => {
  res.json({
    message: 'eCommerce API Gateway',
    version: '1.0.0',
    documentation: '/api-docs',
    health: '/health',
    services: {
      auth: '/api/v1/auth',
      products: '/api/v1/products',
      cart: '/api/v1/cart',
      checkout: '/api/v1/checkout',
      orders: '/api/v1/orders',
      users: '/api/v1/users',
    },
  });
});

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    error: {
      code: 'NOT_FOUND',
      message: `Route ${req.method} ${req.path} not found`,
      statusCode: 404,
    },
    timestamp: new Date().toISOString(),
  });
});

// Error handler (must be last)
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  log.error('Error occurred:', {
    error: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
  });

  res.status(500).json({
    success: false,
    error: {
      code: 'INTERNAL_ERROR',
      message: err.message || 'An unexpected error occurred',
      statusCode: 500,
    },
    timestamp: new Date().toISOString(),
  });
});

// Start server
app.listen(PORT, () => {
  log.info(`API Gateway running on port ${PORT}`);
  log.info(`Environment: ${process.env.NODE_ENV || 'development'}`);
  log.info('Service URLs:');
  Object.entries(SERVICES).forEach(([name, url]) => {
    log.info(`  ${name}: ${url}`);
  });
  log.info(`Documentation: http://localhost:${PORT}/api-docs`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  log.info('SIGTERM signal received: closing HTTP server');
  process.exit(0);
});

process.on('SIGINT', () => {
  log.info('SIGINT signal received: closing HTTP server');
  process.exit(0);
});

export default app;

// Made with Bob
