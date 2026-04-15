# 🚀 Deployment Guide

Complete guide for deploying the Enterprise Angular eCommerce Platform to production.

## Table of Contents

1. [Deployment Options](#deployment-options)
2. [Build Process](#build-process)
3. [Docker Deployment](#docker-deployment)
4. [Kubernetes Deployment](#kubernetes-deployment)
5. [Cloud Platforms](#cloud-platforms)
6. [CI/CD Pipeline](#cicd-pipeline)
7. [Environment Configuration](#environment-configuration)
8. [Performance Optimization](#performance-optimization)
9. [Monitoring & Logging](#monitoring--logging)
10. [Security Considerations](#security-considerations)

## Deployment Options

### Option 1: Monorepo Deployment
Deploy all applications together with shared CDN for common chunks.

**Pros:**
- Simplified deployment process
- Shared dependencies reduce bundle size
- Single CI/CD pipeline

**Cons:**
- All apps must be deployed together
- Longer build times

### Option 2: Independent Deployment
Each microfrontend deployed separately with version management.

**Pros:**
- Independent release cycles
- Faster deployments
- Better fault isolation

**Cons:**
- More complex infrastructure
- Version management overhead

## Build Process

### Production Build

```bash
# Build all applications
npm run build:all -- --configuration production

# Build specific application
npm run build:b2c -- --configuration production
npm run build:b2b -- --configuration production
npm run build:admin -- --configuration production
```

### Build Output

```
dist/
├── apps/
│   ├── b2c-app/
│   │   ├── browser/
│   │   │   ├── index.html
│   │   │   ├── main.*.js
│   │   │   ├── polyfills.*.js
│   │   │   ├── remoteEntry.js
│   │   │   └── assets/
│   │   └── server/ (if SSR enabled)
│   ├── b2b-app/
│   └── admin-app/
└── libs/
    └── features/
        ├── auth/
        ├── product/
        └── ...
```

### Build Optimization

```json
// angular.json
{
  "configurations": {
    "production": {
      "optimization": true,
      "outputHashing": "all",
      "sourceMap": false,
      "namedChunks": false,
      "aot": true,
      "extractLicenses": true,
      "vendorChunk": false,
      "buildOptimizer": true,
      "budgets": [
        {
          "type": "initial",
          "maximumWarning": "2mb",
          "maximumError": "5mb"
        }
      ]
    }
  }
}
```

## Docker Deployment

### Dockerfile for B2C App

```dockerfile
# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY pnpm-lock.yaml ./

# Install dependencies
RUN npm install -g pnpm
RUN pnpm install --frozen-lockfile

# Copy source code
COPY . .

# Build application
RUN pnpm run build:b2c -- --configuration production

# Production stage
FROM nginx:alpine

# Copy built application
COPY --from=builder /app/dist/apps/b2c-app/browser /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Expose port
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost/health || exit 1

CMD ["nginx", "-g", "daemon off;"]
```

### Nginx Configuration

```nginx
# nginx.conf
events {
    worker_connections 1024;
}

http {
    include /etc/nginx/mime.types;
    default_type application/octet-stream;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript 
               application/x-javascript application/xml+rss 
               application/javascript application/json;

    server {
        listen 80;
        server_name _;
        root /usr/share/nginx/html;
        index index.html;

        # Security headers
        add_header X-Frame-Options "SAMEORIGIN" always;
        add_header X-Content-Type-Options "nosniff" always;
        add_header X-XSS-Protection "1; mode=block" always;
        add_header Referrer-Policy "no-referrer-when-downgrade" always;
        add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;

        # Cache static assets
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }

        # Angular routing
        location / {
            try_files $uri $uri/ /index.html;
        }

        # Health check endpoint
        location /health {
            access_log off;
            return 200 "healthy\n";
            add_header Content-Type text/plain;
        }
    }
}
```

### Docker Compose

```yaml
# docker-compose.yml
version: '3.8'

services:
  b2c-app:
    build:
      context: .
      dockerfile: apps/b2c-app/Dockerfile
    ports:
      - "4200:80"
    environment:
      - NODE_ENV=production
    restart: unless-stopped
    networks:
      - ecommerce-network

  b2b-app:
    build:
      context: .
      dockerfile: apps/b2b-app/Dockerfile
    ports:
      - "4300:80"
    environment:
      - NODE_ENV=production
    restart: unless-stopped
    networks:
      - ecommerce-network

  admin-app:
    build:
      context: .
      dockerfile: apps/admin-app/Dockerfile
    ports:
      - "4400:80"
    environment:
      - NODE_ENV=production
    restart: unless-stopped
    networks:
      - ecommerce-network

  # Feature remotes
  auth-remote:
    build:
      context: .
      dockerfile: libs/features/auth/Dockerfile
    ports:
      - "4201:80"
    restart: unless-stopped
    networks:
      - ecommerce-network

  product-remote:
    build:
      context: .
      dockerfile: libs/features/product/Dockerfile
    ports:
      - "4202:80"
    restart: unless-stopped
    networks:
      - ecommerce-network

networks:
  ecommerce-network:
    driver: bridge
```

### Build and Run

```bash
# Build all images
docker-compose build

# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down
```

## Kubernetes Deployment

### Deployment Configuration

```yaml
# k8s/b2c-app-deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: b2c-app
  namespace: ecommerce
  labels:
    app: b2c-app
    version: v1.0.0
spec:
  replicas: 3
  selector:
    matchLabels:
      app: b2c-app
  template:
    metadata:
      labels:
        app: b2c-app
        version: v1.0.0
    spec:
      containers:
      - name: b2c-app
        image: ecommerce/b2c-app:1.0.0
        ports:
        - containerPort: 80
          name: http
        resources:
          requests:
            memory: "256Mi"
            cpu: "250m"
          limits:
            memory: "512Mi"
            cpu: "500m"
        livenessProbe:
          httpGet:
            path: /health
            port: 80
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /health
            port: 80
          initialDelaySeconds: 5
          periodSeconds: 5
        env:
        - name: NODE_ENV
          value: "production"
        - name: API_URL
          valueFrom:
            configMapKeyRef:
              name: app-config
              key: api-url
---
apiVersion: v1
kind: Service
metadata:
  name: b2c-app-service
  namespace: ecommerce
spec:
  selector:
    app: b2c-app
  ports:
  - protocol: TCP
    port: 80
    targetPort: 80
  type: LoadBalancer
```

### Ingress Configuration

```yaml
# k8s/ingress.yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: ecommerce-ingress
  namespace: ecommerce
  annotations:
    kubernetes.io/ingress.class: nginx
    cert-manager.io/cluster-issuer: letsencrypt-prod
    nginx.ingress.kubernetes.io/ssl-redirect: "true"
spec:
  tls:
  - hosts:
    - www.ecommerce.com
    - b2b.ecommerce.com
    - admin.ecommerce.com
    secretName: ecommerce-tls
  rules:
  - host: www.ecommerce.com
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: b2c-app-service
            port:
              number: 80
  - host: b2b.ecommerce.com
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: b2b-app-service
            port:
              number: 80
  - host: admin.ecommerce.com
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: admin-app-service
            port:
              number: 80
```

### ConfigMap

```yaml
# k8s/configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: app-config
  namespace: ecommerce
data:
  api-url: "https://api.ecommerce.com"
  auth-remote-url: "https://cdn.ecommerce.com/auth/remoteEntry.js"
  product-remote-url: "https://cdn.ecommerce.com/product/remoteEntry.js"
  cart-remote-url: "https://cdn.ecommerce.com/cart/remoteEntry.js"
```

### Deploy to Kubernetes

```bash
# Create namespace
kubectl create namespace ecommerce

# Apply configurations
kubectl apply -f k8s/configmap.yaml
kubectl apply -f k8s/b2c-app-deployment.yaml
kubectl apply -f k8s/b2b-app-deployment.yaml
kubectl apply -f k8s/admin-app-deployment.yaml
kubectl apply -f k8s/ingress.yaml

# Check deployment status
kubectl get deployments -n ecommerce
kubectl get pods -n ecommerce
kubectl get services -n ecommerce

# View logs
kubectl logs -f deployment/b2c-app -n ecommerce
```

## Cloud Platforms

### AWS Deployment

#### Using AWS Amplify

```bash
# Install Amplify CLI
npm install -g @aws-amplify/cli

# Initialize Amplify
amplify init

# Add hosting
amplify add hosting

# Deploy
amplify publish
```

#### Using AWS S3 + CloudFront

```bash
# Build application
npm run build:b2c -- --configuration production

# Sync to S3
aws s3 sync dist/apps/b2c-app/browser s3://ecommerce-b2c-app --delete

# Invalidate CloudFront cache
aws cloudfront create-invalidation --distribution-id DISTRIBUTION_ID --paths "/*"
```

### Azure Deployment

```bash
# Install Azure CLI
az login

# Create resource group
az group create --name ecommerce-rg --location eastus

# Create App Service plan
az appservice plan create --name ecommerce-plan --resource-group ecommerce-rg --sku B1 --is-linux

# Create web app
az webapp create --resource-group ecommerce-rg --plan ecommerce-plan --name ecommerce-b2c --runtime "NODE|20-lts"

# Deploy
az webapp deployment source config-zip --resource-group ecommerce-rg --name ecommerce-b2c --src dist.zip
```

### Google Cloud Platform

```bash
# Install gcloud CLI
gcloud init

# Build and deploy to App Engine
gcloud app deploy

# Or deploy to Cloud Run
gcloud run deploy b2c-app --image gcr.io/PROJECT_ID/b2c-app --platform managed --region us-central1
```

## CI/CD Pipeline

### GitHub Actions

```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

env:
  NODE_VERSION: '20'

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run linter
        run: npm run lint
      
      - name: Run tests
        run: npm run test:ci
      
      - name: Upload coverage
        uses: codecov/codecov-action@v3

  build:
    needs: test
    runs-on: ubuntu-latest
    strategy:
      matrix:
        app: [b2c-app, b2b-app, admin-app]
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build ${{ matrix.app }}
        run: npm run build:${{ matrix.app }} -- --configuration production
      
      - name: Upload artifacts
        uses: actions/upload-artifact@v3
        with:
          name: ${{ matrix.app }}
          path: dist/apps/${{ matrix.app }}

  deploy:
    needs: build
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    strategy:
      matrix:
        app: [b2c-app, b2b-app, admin-app]
    steps:
      - name: Download artifacts
        uses: actions/download-artifact@v3
        with:
          name: ${{ matrix.app }}
          path: dist/apps/${{ matrix.app }}
      
      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v2
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: us-east-1
      
      - name: Deploy to S3
        run: |
          aws s3 sync dist/apps/${{ matrix.app }}/browser s3://ecommerce-${{ matrix.app }} --delete
      
      - name: Invalidate CloudFront
        run: |
          aws cloudfront create-invalidation --distribution-id ${{ secrets.CLOUDFRONT_DISTRIBUTION_ID }} --paths "/*"
```

### GitLab CI

```yaml
# .gitlab-ci.yml
stages:
  - test
  - build
  - deploy

variables:
  NODE_VERSION: "20"

test:
  stage: test
  image: node:${NODE_VERSION}
  script:
    - npm ci
    - npm run lint
    - npm run test:ci
  coverage: '/Lines\s*:\s*(\d+\.\d+)%/'
  artifacts:
    reports:
      coverage_report:
        coverage_format: cobertura
        path: coverage/cobertura-coverage.xml

build:
  stage: build
  image: node:${NODE_VERSION}
  script:
    - npm ci
    - npm run build:all -- --configuration production
  artifacts:
    paths:
      - dist/
    expire_in: 1 week

deploy:production:
  stage: deploy
  image: google/cloud-sdk:alpine
  only:
    - main
  script:
    - echo $GCP_SERVICE_KEY | base64 -d > ${HOME}/gcp-key.json
    - gcloud auth activate-service-account --key-file ${HOME}/gcp-key.json
    - gcloud config set project $GCP_PROJECT_ID
    - gsutil -m rsync -r -d dist/apps/b2c-app/browser gs://ecommerce-b2c-app
```

## Environment Configuration

### Production Environment

```typescript
// apps/b2c-app/src/environments/environment.prod.ts
export const environment = {
  production: true,
  apiUrl: 'https://api.ecommerce.com',
  
  remotes: {
    auth: 'https://cdn.ecommerce.com/auth/v1.0.0/remoteEntry.js',
    product: 'https://cdn.ecommerce.com/product/v1.0.0/remoteEntry.js',
    cart: 'https://cdn.ecommerce.com/cart/v1.0.0/remoteEntry.js',
    checkout: 'https://cdn.ecommerce.com/checkout/v1.0.0/remoteEntry.js',
    order: 'https://cdn.ecommerce.com/order/v1.0.0/remoteEntry.js',
  },
  
  features: {
    enableAnalytics: true,
    enableErrorTracking: true,
    enablePerformanceMonitoring: true,
  },
  
  analytics: {
    googleAnalyticsId: 'GA-XXXXXXXXX',
  },
  
  sentry: {
    dsn: 'https://xxxxx@sentry.io/xxxxx',
    environment: 'production',
  }
};
```

## Performance Optimization

### CDN Configuration

```javascript
// Use CDN for static assets
const cdnUrl = 'https://cdn.ecommerce.com';

// In angular.json
{
  "deployUrl": "https://cdn.ecommerce.com/b2c-app/"
}
```

### Caching Strategy

```nginx
# Cache-Control headers
location ~* \.(js|css)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}

location ~* \.(jpg|jpeg|png|gif|ico|svg)$ {
    expires 6M;
    add_header Cache-Control "public, immutable";
}
```

### Service Worker

```typescript
// Enable service worker for PWA
{
  "serviceWorker": true,
  "ngswConfigPath": "ngsw-config.json"
}
```

## Monitoring & Logging

### Application Monitoring

```typescript
// Sentry integration
import * as Sentry from "@sentry/angular";

Sentry.init({
  dsn: environment.sentry.dsn,
  environment: environment.sentry.environment,
  tracesSampleRate: 1.0,
});
```

### Performance Monitoring

```typescript
// Web Vitals
import {onCLS, onFID, onLCP} from 'web-vitals';

onCLS(console.log);
onFID(console.log);
onLCP(console.log);
```

### Logging

```typescript
// Structured logging
export class LoggerService {
  log(level: string, message: string, context?: any) {
    const logEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      context,
      environment: environment.production ? 'production' : 'development'
    };
    
    // Send to logging service
    this.sendToLoggingService(logEntry);
  }
}
```

## Security Considerations

### SSL/TLS Configuration

```nginx
# Force HTTPS
server {
    listen 80;
    server_name ecommerce.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name ecommerce.com;
    
    ssl_certificate /etc/ssl/certs/ecommerce.crt;
    ssl_certificate_key /etc/ssl/private/ecommerce.key;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
}
```

### Security Headers

```nginx
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-Content-Type-Options "nosniff" always;
add_header X-XSS-Protection "1; mode=block" always;
add_header Referrer-Policy "no-referrer-when-downgrade" always;
```

### Environment Secrets

```bash
# Use environment variables for secrets
export API_KEY=your-api-key
export DATABASE_URL=your-database-url
export JWT_SECRET=your-jwt-secret

# Or use secret management services
# AWS Secrets Manager
# Azure Key Vault
# Google Secret Manager
```

## Rollback Strategy

### Version Management

```bash
# Tag releases
git tag -a v1.0.0 -m "Release version 1.0.0"
git push origin v1.0.0

# Rollback to previous version
kubectl rollout undo deployment/b2c-app -n ecommerce

# Or specify revision
kubectl rollout undo deployment/b2c-app --to-revision=2 -n ecommerce
```

### Blue-Green Deployment

```yaml
# Deploy new version (green)
kubectl apply -f k8s/b2c-app-deployment-v2.yaml

# Switch traffic
kubectl patch service b2c-app-service -p '{"spec":{"selector":{"version":"v2.0.0"}}}'

# Rollback if needed
kubectl patch service b2c-app-service -p '{"spec":{"selector":{"version":"v1.0.0"}}}'
```

## Post-Deployment Checklist

- [ ] Verify all applications are running
- [ ] Check health endpoints
- [ ] Test critical user journeys
- [ ] Verify SSL certificates
- [ ] Check monitoring dashboards
- [ ] Review error logs
- [ ] Test payment integration
- [ ] Verify email notifications
- [ ] Check CDN cache
- [ ] Update documentation
- [ ] Notify stakeholders

---

**For support, contact DevOps team at devops@ecommerce.com**