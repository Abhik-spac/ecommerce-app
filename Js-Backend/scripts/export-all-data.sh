#!/bin/bash

# Export All Database Data Script
# This script exports data from MongoDB, PostgreSQL, and Redis to JSON/text files

echo "🔍 Exporting all database data..."
echo ""

# Create export directory
EXPORT_DIR="./database-exports"
mkdir -p $EXPORT_DIR
cd $EXPORT_DIR

echo "📦 Exporting MongoDB data..."

# Export Products
echo "  - Exporting products..."
mongoexport --db=ecommerce-products --collection=products --out=products.json --jsonArray --pretty 2>/dev/null
if [ $? -eq 0 ]; then
    PRODUCT_COUNT=$(mongosh --quiet --eval "db.getSiblingDB('ecommerce-products').products.countDocuments()")
    echo "    ✅ Exported $PRODUCT_COUNT products to products.json"
else
    echo "    ❌ Failed to export products"
fi

# Export Users (without passwords)
echo "  - Exporting users..."
mongosh --quiet --eval "
    db.getSiblingDB('ecommerce-auth').users.find({}, {password: 0}).forEach(function(doc) {
        print(JSON.stringify(doc, null, 2));
    });
" > users.json 2>/dev/null
if [ $? -eq 0 ]; then
    USER_COUNT=$(mongosh --quiet --eval "db.getSiblingDB('ecommerce-auth').users.countDocuments()")
    echo "    ✅ Exported $USER_COUNT users to users.json"
else
    echo "    ❌ Failed to export users"
fi

echo ""
echo "🐘 Exporting PostgreSQL data..."

# Export Orders
echo "  - Exporting orders..."
psql -h localhost -p 5432 -U admin -d ecommerce_orders -c "\COPY (SELECT * FROM orders) TO STDOUT WITH (FORMAT JSON)" > orders.json 2>/dev/null
if [ $? -eq 0 ]; then
    ORDER_COUNT=$(psql -h localhost -p 5432 -U admin -d ecommerce_orders -t -c "SELECT COUNT(*) FROM orders" 2>/dev/null | xargs)
    echo "    ✅ Exported $ORDER_COUNT orders to orders.json"
else
    echo "    ❌ Failed to export orders (table may not exist yet)"
    echo "[]" > orders.json
fi

echo ""
echo "🔴 Exporting Redis data..."

# Export Cart keys
echo "  - Exporting cart data..."
redis-cli KEYS "cart:*" > cart_keys.txt 2>/dev/null
if [ $? -eq 0 ]; then
    CART_COUNT=$(redis-cli KEYS "cart:*" | wc -l | xargs)
    echo "    ✅ Found $CART_COUNT cart keys in cart_keys.txt"
    
    # Export cart contents
    echo "[" > carts.json
    FIRST=true
    while IFS= read -r key; do
        if [ ! -z "$key" ]; then
            if [ "$FIRST" = false ]; then
                echo "," >> carts.json
            fi
            FIRST=false
            VALUE=$(redis-cli GET "$key")
            echo "  {\"key\": \"$key\", \"value\": $VALUE}" >> carts.json
        fi
    done < cart_keys.txt
    echo "" >> carts.json
    echo "]" >> carts.json
    echo "    ✅ Exported cart contents to carts.json"
else
    echo "    ❌ Failed to export carts"
fi

echo ""
echo "📊 Creating summary..."

# Create summary file
cat > SUMMARY.txt << EOF
Database Export Summary
Generated: $(date)
=======================

MongoDB Databases:
------------------
- ecommerce-products: $(mongosh --quiet --eval "db.getSiblingDB('ecommerce-products').products.countDocuments()" 2>/dev/null || echo "0") products
- ecommerce-auth: $(mongosh --quiet --eval "db.getSiblingDB('ecommerce-auth').users.countDocuments()" 2>/dev/null || echo "0") users
- ecommerce-users: $(mongosh --quiet --eval "db.getSiblingDB('ecommerce-users').users.countDocuments()" 2>/dev/null || echo "0") user profiles

PostgreSQL Database:
--------------------
- ecommerce_orders: $(psql -h localhost -p 5432 -U admin -d ecommerce_orders -t -c "SELECT COUNT(*) FROM orders" 2>/dev/null | xargs || echo "0") orders

Redis Cache:
------------
- Total keys: $(redis-cli DBSIZE 2>/dev/null || echo "0")
- Cart keys: $(redis-cli KEYS "cart:*" 2>/dev/null | wc -l | xargs || echo "0")

Exported Files:
---------------
- products.json     : Product catalog
- users.json        : User accounts (passwords excluded)
- orders.json       : Order history
- carts.json        : Shopping cart data
- cart_keys.txt     : List of cart keys in Redis
- SUMMARY.txt       : This file

View Files:
-----------
cat products.json | jq .     # View products (requires jq)
cat users.json | jq .        # View users (requires jq)
cat orders.json | jq .       # View orders (requires jq)
cat carts.json | jq .        # View carts (requires jq)

Or simply:
cat products.json            # View raw JSON
EOF

echo "✅ Export complete!"
echo ""
echo "📁 Files saved in: $(pwd)"
echo ""
echo "📄 Exported files:"
ls -lh *.json *.txt 2>/dev/null | awk '{print "   ", $9, "-", $5}'
echo ""
echo "📖 View summary: cat SUMMARY.txt"
echo "🔍 View products: cat products.json"
echo "👥 View users: cat users.json"
echo "📦 View orders: cat orders.json"
echo "🛒 View carts: cat carts.json"
echo ""

# Made with Bob
