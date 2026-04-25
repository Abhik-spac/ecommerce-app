# Database Inspection Guide

This guide shows you how to view and inspect data in your local databases.

## MongoDB Databases

We have 3 MongoDB databases:
- `ecommerce-auth` (port 27017) - User authentication data
- `ecommerce-products` (port 27017) - Product catalog
- `ecommerce-users` (port 27017) - User profiles

### Option 1: MongoDB Compass (GUI - Recommended)

1. **Download MongoDB Compass**: https://www.mongodb.com/try/download/compass
2. **Connect**: Use connection string `mongodb://localhost:27017`
3. **Browse databases**: Click on each database to see collections and documents

### Option 2: MongoDB Shell (CLI)

```bash
# Connect to MongoDB
mongosh

# List all databases
show dbs

# Switch to a database
use ecommerce-products

# List collections
show collections

# View all products
db.products.find().pretty()

# Count products
db.products.countDocuments()

# Find specific product
db.products.findOne({ name: "Laptop" })

# View users in auth database
use ecommerce-auth
db.users.find().pretty()
```

### Option 3: Export to JSON Files

```bash
# Export products to JSON
mongoexport --db=ecommerce-products --collection=products --out=products.json --pretty

# Export users to JSON
mongoexport --db=ecommerce-auth --collection=users --out=users.json --pretty

# View the JSON file
cat products.json
```

## PostgreSQL Database

Database: `ecommerce_orders` (port 5432)

### Option 1: pgAdmin (GUI - Recommended)

1. **Download pgAdmin**: https://www.pgadmin.org/download/
2. **Add Server**:
   - Host: localhost
   - Port: 5432
   - Database: ecommerce_orders
   - Username: admin
   - Password: password123
3. **Browse**: Navigate to Databases → ecommerce_orders → Schemas → public → Tables

### Option 2: psql (CLI)

```bash
# Connect to PostgreSQL
psql -h localhost -p 5432 -U admin -d ecommerce_orders

# List all tables
\dt

# View orders table structure
\d orders

# View all orders
SELECT * FROM orders;

# Count orders
SELECT COUNT(*) FROM orders;

# View recent orders
SELECT * FROM orders ORDER BY created_at DESC LIMIT 10;

# Exit psql
\q
```

### Option 3: Export to CSV

```bash
# Export orders to CSV
psql -h localhost -p 5432 -U admin -d ecommerce_orders -c "COPY orders TO '/tmp/orders.csv' CSV HEADER"

# View the CSV
cat /tmp/orders.csv
```

## Redis Cache

Database: Cart data (port 6379)

### Option 1: Redis Insight (GUI - Recommended)

1. **Download Redis Insight**: https://redis.io/insight/
2. **Add Database**:
   - Host: localhost
   - Port: 6379
3. **Browse**: View all keys and their values

### Option 2: redis-cli (CLI)

```bash
# Connect to Redis
redis-cli

# List all keys
KEYS *

# View specific cart (replace with actual key)
GET cart:user123

# View all cart keys
KEYS cart:*

# Get key type
TYPE cart:user123

# View hash fields (if cart is stored as hash)
HGETALL cart:user123

# Count all keys
DBSIZE

# Exit redis-cli
exit
```

### Option 3: Export Redis Data

```bash
# Save Redis data to dump file
redis-cli SAVE

# The dump.rdb file is saved in Redis data directory
# Usually: /var/lib/redis/dump.rdb or /usr/local/var/db/redis/dump.rdb
```

## Quick Data Inspection Scripts

### View All Products (MongoDB)

```bash
mongosh --eval "use ecommerce-products; db.products.find().forEach(printjson)" > products_dump.json
cat products_dump.json
```

### View All Users (MongoDB)

```bash
mongosh --eval "use ecommerce-auth; db.users.find({}, {password: 0}).forEach(printjson)" > users_dump.json
cat users_dump.json
```

### View All Orders (PostgreSQL)

```bash
psql -h localhost -p 5432 -U admin -d ecommerce_orders -c "SELECT * FROM orders" > orders_dump.txt
cat orders_dump.txt
```

### View All Cart Keys (Redis)

```bash
redis-cli KEYS "cart:*" > cart_keys.txt
cat cart_keys.txt
```

## Database Statistics

### MongoDB Stats

```bash
mongosh --eval "
  use ecommerce-products;
  print('Products:', db.products.countDocuments());
  use ecommerce-auth;
  print('Users:', db.users.countDocuments());
"
```

### PostgreSQL Stats

```bash
psql -h localhost -p 5432 -U admin -d ecommerce_orders -c "
  SELECT 
    'Orders' as table_name, 
    COUNT(*) as row_count 
  FROM orders;
"
```

### Redis Stats

```bash
redis-cli INFO stats | grep keys
redis-cli DBSIZE
```

## Viewing Data in VS Code

You can install database extensions in VS Code:

1. **MongoDB for VS Code** - Browse MongoDB databases
2. **PostgreSQL** - Connect to PostgreSQL
3. **Redis** - View Redis keys

## Sample Queries

### Find Products by Category

```javascript
// MongoDB Shell
use ecommerce-products
db.products.find({ category: "Electronics" }).pretty()
```

### Find User by Email

```javascript
// MongoDB Shell
use ecommerce-auth
db.users.findOne({ email: "user@example.com" })
```

### Find Orders by User

```sql
-- PostgreSQL
SELECT * FROM orders WHERE user_id = 'user123' ORDER BY created_at DESC;
```

### View Cart Contents

```bash
# Redis CLI
redis-cli GET cart:user123
```

## Backup Your Data

### MongoDB Backup

```bash
# Backup all databases
mongodump --out=/path/to/backup

# Backup specific database
mongodump --db=ecommerce-products --out=/path/to/backup
```

### PostgreSQL Backup

```bash
# Backup database
pg_dump -h localhost -p 5432 -U admin ecommerce_orders > backup.sql
```

### Redis Backup

```bash
# Create snapshot
redis-cli SAVE

# Copy dump.rdb file
cp /var/lib/redis/dump.rdb /path/to/backup/
```

## Troubleshooting

### Can't connect to MongoDB
```bash
# Check if MongoDB is running
brew services list | grep mongodb
# or
sudo systemctl status mongod
```

### Can't connect to PostgreSQL
```bash
# Check if PostgreSQL is running
brew services list | grep postgresql
# or
sudo systemctl status postgresql
```

### Can't connect to Redis
```bash
# Check if Redis is running
brew services list | grep redis
# or
sudo systemctl status redis
```

## Data Locations

### MongoDB Data Directory
- macOS: `/usr/local/var/mongodb/`
- Linux: `/var/lib/mongodb/`
- Windows: `C:\Program Files\MongoDB\Server\{version}\data\`

### PostgreSQL Data Directory
- macOS: `/usr/local/var/postgres/`
- Linux: `/var/lib/postgresql/{version}/main/`
- Windows: `C:\Program Files\PostgreSQL\{version}\data\`

### Redis Data Directory
- macOS: `/usr/local/var/db/redis/`
- Linux: `/var/lib/redis/`
- Windows: `C:\Program Files\Redis\`

For more help, refer to the official documentation of each database system.