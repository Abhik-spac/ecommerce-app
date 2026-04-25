#!/bin/bash

# Setup script to create all service files and install dependencies

echo "🚀 Setting up all microservices..."

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Create tsconfig.json for each service
create_tsconfig() {
    local service_path=$1
    cat > "$service_path/tsconfig.json" << 'EOF'
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "lib": ["ES2020"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "moduleResolution": "node",
    "types": ["node"],
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
EOF
    echo -e "${GREEN}✓${NC} Created tsconfig.json for $service_path"
}

# Create .env.example for each service
create_env_example() {
    local service_path=$1
    local service_name=$2
    local port=$3
    
    case $service_name in
        "auth-service")
            cat > "$service_path/.env.example" << 'EOF'
PORT=3001
MONGODB_URI=mongodb://admin:password123@localhost:27017/ecommerce?authSource=admin
JWT_ACCESS_SECRET=your-secret-key-change-in-production
JWT_REFRESH_SECRET=your-refresh-secret-key
NODE_ENV=development
EOF
            ;;
        "product-service")
            cat > "$service_path/.env.example" << 'EOF'
PORT=3002
MONGODB_URI=mongodb://admin:password123@localhost:27017/ecommerce?authSource=admin
NODE_ENV=development
EOF
            ;;
        "cart-service")
            cat > "$service_path/.env.example" << 'EOF'
PORT=3003
REDIS_URL=redis://localhost:6379
NODE_ENV=development
EOF
            ;;
        "checkout-service")
            cat > "$service_path/.env.example" << 'EOF'
PORT=3004
NODE_ENV=development
EOF
            ;;
        "order-service")
            cat > "$service_path/.env.example" << 'EOF'
PORT=3005
DB_HOST=localhost
DB_PORT=5432
DB_NAME=ecommerce_orders
DB_USER=admin
DB_PASSWORD=password123
NODE_ENV=development
EOF
            ;;
        "user-service")
            cat > "$service_path/.env.example" << 'EOF'
PORT=3006
MONGODB_URI=mongodb://admin:password123@localhost:27017/ecommerce?authSource=admin
NODE_ENV=development
EOF
            ;;
    esac
    
    # Copy to .env
    cp "$service_path/.env.example" "$service_path/.env"
    echo -e "${GREEN}✓${NC} Created .env files for $service_name"
}

# Setup each service
setup_service() {
    local service_name=$1
    local service_path="services/$service_name"
    
    echo -e "\n${YELLOW}Setting up $service_name...${NC}"
    
    # Create tsconfig.json
    create_tsconfig "$service_path"
    
    # Create .env files
    create_env_example "$service_path" "$service_name"
    
    # Install dependencies
    echo "Installing dependencies for $service_name..."
    cd "$service_path" && npm install && cd ../..
    
    echo -e "${GREEN}✓${NC} $service_name setup complete"
}

# Main execution
cd "$(dirname "$0")"

# Setup all services
setup_service "auth-service"
setup_service "product-service"
setup_service "cart-service"
setup_service "checkout-service"
setup_service "order-service"
setup_service "user-service"
setup_service "api-gateway"

echo -e "\n${GREEN}✅ All services setup complete!${NC}"
echo -e "\n${YELLOW}Next steps:${NC}"
echo "1. Start Docker containers: cd infrastructure/docker && docker-compose up -d"
echo "2. Run database migration: psql -h localhost -U admin -d ecommerce_orders -f services/order-service/migrations/001_initial_schema.sql"
echo "3. Start all services: npm run dev"

# Made with Bob
