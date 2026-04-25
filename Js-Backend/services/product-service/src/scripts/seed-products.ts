import mongoose from 'mongoose';
import Product from '../models/Product';

const MONGODB_URI = process.env.MONGODB_URI!;

const mockProducts = [
  // Electronics - Smartphones
  {
    sku: 'PHONE-001',
    name: 'iPhone 15 Pro Max',
    slug: 'iphone-15-pro-max',
    description: 'The most powerful iPhone ever with A17 Pro chip, titanium design, and advanced camera system. Features ProMotion display with 120Hz refresh rate.',
    shortDescription: 'Premium flagship smartphone with titanium design',
    categoryId: 'electronics',
    price: 129999,
    compareAtPrice: 139999,
    status: 'active',
    images: [
      { id: 'img1', url: '/images/iphone-15-pro-1.jpg', alt: 'iPhone 15 Pro Max Front', position: 0, isDefault: true },
      { id: 'img2', url: '/images/iphone-15-pro-2.jpg', alt: 'iPhone 15 Pro Max Back', position: 1, isDefault: false }
    ],
    variants: [],
    attributes: [
      { name: 'Storage', value: '256GB', displayOrder: 1 },
      { name: 'Color', value: 'Natural Titanium', displayOrder: 2 },
      { name: 'Display', value: '6.7" Super Retina XDR', displayOrder: 3 }
    ],
    inventory: {
      quantity: 50,
      lowStockThreshold: 10,
      trackInventory: true,
      allowBackorder: false,
      sku: 'PHONE-001'
    },
    tags: ['smartphone', 'apple', 'flagship', 'premium'],
    isFeatured: true,
    isNew: true,
    rating: 4.8,
    reviewCount: 245,
    category: 'Electronics',
    brand: 'Apple',
    stock: 50
  },
  {
    sku: 'PHONE-002',
    name: 'Samsung Galaxy S24 Ultra',
    slug: 'samsung-galaxy-s24-ultra',
    description: 'Ultimate Android flagship with S Pen, 200MP camera, and AI-powered features. Snapdragon 8 Gen 3 processor delivers exceptional performance.',
    shortDescription: 'Premium Android flagship with S Pen',
    categoryId: 'electronics',
    price: 124999,
    compareAtPrice: 134999,
    status: 'active',
    images: [
      { id: 'img3', url: '/images/galaxy-s24-1.jpg', alt: 'Galaxy S24 Ultra', position: 0, isDefault: true }
    ],
    variants: [],
    attributes: [
      { name: 'Storage', value: '512GB', displayOrder: 1 },
      { name: 'Color', value: 'Titanium Gray', displayOrder: 2 },
      { name: 'RAM', value: '12GB', displayOrder: 3 }
    ],
    inventory: {
      quantity: 45,
      lowStockThreshold: 10,
      trackInventory: true,
      allowBackorder: false,
      sku: 'PHONE-002'
    },
    tags: ['smartphone', 'samsung', 'android', 'flagship'],
    isFeatured: true,
    isNew: true,
    rating: 4.7,
    reviewCount: 189,
    category: 'Electronics',
    brand: 'Samsung',
    stock: 45
  },
  {
    sku: 'PHONE-003',
    name: 'Google Pixel 8 Pro',
    slug: 'google-pixel-8-pro',
    description: 'Best Android camera phone with Google Tensor G3 chip and advanced AI features. Pure Android experience with 7 years of updates.',
    shortDescription: 'AI-powered camera phone with pure Android',
    categoryId: 'electronics',
    price: 89999,
    status: 'active',
    images: [
      { id: 'img4', url: '/images/pixel-8-pro-1.jpg', alt: 'Pixel 8 Pro', position: 0, isDefault: true }
    ],
    variants: [],
    attributes: [
      { name: 'Storage', value: '256GB', displayOrder: 1 },
      { name: 'Color', value: 'Obsidian', displayOrder: 2 }
    ],
    inventory: {
      quantity: 35,
      lowStockThreshold: 10,
      trackInventory: true,
      allowBackorder: false,
      sku: 'PHONE-003'
    },
    tags: ['smartphone', 'google', 'android', 'camera'],
    isFeatured: false,
    isNew: true,
    rating: 4.6,
    reviewCount: 156,
    category: 'Electronics',
    brand: 'Google',
    stock: 35
  },

  // Electronics - Laptops
  {
    sku: 'LAPTOP-001',
    name: 'MacBook Pro 16" M3 Max',
    slug: 'macbook-pro-16-m3-max',
    description: 'Professional laptop with M3 Max chip, stunning Liquid Retina XDR display, and up to 22 hours battery life. Perfect for creative professionals.',
    shortDescription: 'Professional laptop with M3 Max chip',
    categoryId: 'electronics',
    price: 349999,
    compareAtPrice: 369999,
    status: 'active',
    images: [
      { id: 'img5', url: '/images/macbook-pro-1.jpg', alt: 'MacBook Pro 16', position: 0, isDefault: true }
    ],
    variants: [],
    attributes: [
      { name: 'Processor', value: 'M3 Max', displayOrder: 1 },
      { name: 'RAM', value: '36GB', displayOrder: 2 },
      { name: 'Storage', value: '1TB SSD', displayOrder: 3 }
    ],
    inventory: {
      quantity: 25,
      lowStockThreshold: 5,
      trackInventory: true,
      allowBackorder: false,
      sku: 'LAPTOP-001'
    },
    tags: ['laptop', 'apple', 'professional', 'creative'],
    isFeatured: true,
    isNew: false,
    rating: 4.9,
    reviewCount: 312,
    category: 'Electronics',
    brand: 'Apple',
    stock: 25
  },
  {
    sku: 'LAPTOP-002',
    name: 'Dell XPS 15',
    slug: 'dell-xps-15',
    description: 'Premium Windows laptop with Intel Core i9, NVIDIA RTX 4070, and stunning OLED display. Perfect balance of power and portability.',
    shortDescription: 'Premium Windows laptop with OLED display',
    categoryId: 'electronics',
    price: 189999,
    status: 'active',
    images: [
      { id: 'img6', url: '/images/dell-xps-15-1.jpg', alt: 'Dell XPS 15', position: 0, isDefault: true }
    ],
    variants: [],
    attributes: [
      { name: 'Processor', value: 'Intel Core i9-13900H', displayOrder: 1 },
      { name: 'RAM', value: '32GB', displayOrder: 2 },
      { name: 'Storage', value: '1TB SSD', displayOrder: 3 },
      { name: 'GPU', value: 'NVIDIA RTX 4070', displayOrder: 4 }
    ],
    inventory: {
      quantity: 30,
      lowStockThreshold: 8,
      trackInventory: true,
      allowBackorder: false,
      sku: 'LAPTOP-002'
    },
    tags: ['laptop', 'dell', 'windows', 'gaming'],
    isFeatured: true,
    isNew: false,
    rating: 4.7,
    reviewCount: 198,
    category: 'Electronics',
    brand: 'Dell',
    stock: 30
  },

  // Electronics - Tablets
  {
    sku: 'TABLET-001',
    name: 'iPad Pro 12.9" M2',
    slug: 'ipad-pro-12-9-m2',
    description: 'Ultimate iPad experience with M2 chip, Liquid Retina XDR display, and Apple Pencil support. Perfect for creative work and entertainment.',
    shortDescription: 'Professional tablet with M2 chip',
    categoryId: 'electronics',
    price: 109999,
    status: 'active',
    images: [
      { id: 'img7', url: '/images/ipad-pro-1.jpg', alt: 'iPad Pro 12.9', position: 0, isDefault: true }
    ],
    variants: [],
    attributes: [
      { name: 'Storage', value: '256GB', displayOrder: 1 },
      { name: 'Connectivity', value: 'Wi-Fi + Cellular', displayOrder: 2 }
    ],
    inventory: {
      quantity: 40,
      lowStockThreshold: 10,
      trackInventory: true,
      allowBackorder: false,
      sku: 'TABLET-001'
    },
    tags: ['tablet', 'apple', 'ipad', 'creative'],
    isFeatured: false,
    isNew: false,
    rating: 4.8,
    reviewCount: 267,
    category: 'Electronics',
    brand: 'Apple',
    stock: 40
  },

  // Fashion - Men's Clothing
  {
    sku: 'SHIRT-001',
    name: 'Premium Cotton Formal Shirt',
    slug: 'premium-cotton-formal-shirt',
    description: 'Classic formal shirt made from 100% premium cotton. Perfect for office wear with wrinkle-resistant fabric and comfortable fit.',
    shortDescription: 'Classic formal shirt in premium cotton',
    categoryId: 'fashion',
    price: 1999,
    compareAtPrice: 2999,
    status: 'active',
    images: [
      { id: 'img8', url: '/images/formal-shirt-1.jpg', alt: 'Formal Shirt White', position: 0, isDefault: true }
    ],
    variants: [
      {
        id: 'var1',
        sku: 'SHIRT-001-M-WHITE',
        name: 'Medium - White',
        price: 1999,
        attributes: { Size: 'M', Color: 'White' },
        inventory: { quantity: 50, lowStockThreshold: 10, trackInventory: true, allowBackorder: false, sku: 'SHIRT-001-M-WHITE' }
      },
      {
        id: 'var2',
        sku: 'SHIRT-001-L-WHITE',
        name: 'Large - White',
        price: 1999,
        attributes: { Size: 'L', Color: 'White' },
        inventory: { quantity: 45, lowStockThreshold: 10, trackInventory: true, allowBackorder: false, sku: 'SHIRT-001-L-WHITE' }
      }
    ],
    attributes: [
      { name: 'Material', value: '100% Cotton', displayOrder: 1 },
      { name: 'Fit', value: 'Regular', displayOrder: 2 }
    ],
    inventory: {
      quantity: 95,
      lowStockThreshold: 20,
      trackInventory: true,
      allowBackorder: false,
      sku: 'SHIRT-001'
    },
    tags: ['shirt', 'formal', 'cotton', 'mens'],
    isFeatured: false,
    isNew: false,
    rating: 4.3,
    reviewCount: 89,
    category: 'Fashion',
    brand: 'Raymond',
    stock: 95
  },
  {
    sku: 'JEANS-001',
    name: 'Slim Fit Denim Jeans',
    slug: 'slim-fit-denim-jeans',
    description: 'Comfortable slim fit jeans made from premium denim. Features stretch fabric for all-day comfort and modern styling.',
    shortDescription: 'Comfortable slim fit denim jeans',
    categoryId: 'fashion',
    price: 2499,
    status: 'active',
    images: [
      { id: 'img9', url: '/images/jeans-1.jpg', alt: 'Slim Fit Jeans', position: 0, isDefault: true }
    ],
    variants: [],
    attributes: [
      { name: 'Material', value: 'Denim with Stretch', displayOrder: 1 },
      { name: 'Fit', value: 'Slim', displayOrder: 2 }
    ],
    inventory: {
      quantity: 80,
      lowStockThreshold: 15,
      trackInventory: true,
      allowBackorder: false,
      sku: 'JEANS-001'
    },
    tags: ['jeans', 'denim', 'casual', 'mens'],
    isFeatured: false,
    isNew: false,
    rating: 4.4,
    reviewCount: 134,
    category: 'Fashion',
    brand: 'Levis',
    stock: 80
  },

  // Home & Kitchen
  {
    sku: 'MIXER-001',
    name: 'Premium Mixer Grinder 750W',
    slug: 'premium-mixer-grinder-750w',
    description: 'Powerful 750W mixer grinder with 3 jars. Features stainless steel blades and overload protection for safe operation.',
    shortDescription: 'Powerful 750W mixer grinder with 3 jars',
    categoryId: 'home-kitchen',
    price: 4999,
    compareAtPrice: 6999,
    status: 'active',
    images: [
      { id: 'img10', url: '/images/mixer-1.jpg', alt: 'Mixer Grinder', position: 0, isDefault: true }
    ],
    variants: [],
    attributes: [
      { name: 'Power', value: '750W', displayOrder: 1 },
      { name: 'Jars', value: '3 (Wet, Dry, Chutney)', displayOrder: 2 },
      { name: 'Material', value: 'Stainless Steel', displayOrder: 3 }
    ],
    inventory: {
      quantity: 60,
      lowStockThreshold: 15,
      trackInventory: true,
      allowBackorder: false,
      sku: 'MIXER-001'
    },
    tags: ['mixer', 'grinder', 'kitchen', 'appliance'],
    isFeatured: false,
    isNew: false,
    rating: 4.5,
    reviewCount: 456,
    category: 'Home & Kitchen',
    brand: 'Philips',
    stock: 60
  },

  // Books
  {
    sku: 'BOOK-001',
    name: 'Atomic Habits by James Clear',
    slug: 'atomic-habits-james-clear',
    description: 'Transformative book about building good habits and breaking bad ones. Learn the proven framework for improving every day.',
    shortDescription: 'Build better habits with proven strategies',
    categoryId: 'books',
    price: 599,
    compareAtPrice: 799,
    status: 'active',
    images: [
      { id: 'img11', url: '/images/atomic-habits-1.jpg', alt: 'Atomic Habits Book', position: 0, isDefault: true }
    ],
    variants: [],
    attributes: [
      { name: 'Author', value: 'James Clear', displayOrder: 1 },
      { name: 'Pages', value: '320', displayOrder: 2 },
      { name: 'Language', value: 'English', displayOrder: 3 }
    ],
    inventory: {
      quantity: 150,
      lowStockThreshold: 30,
      trackInventory: true,
      allowBackorder: true,
      sku: 'BOOK-001'
    },
    tags: ['book', 'self-help', 'habits', 'bestseller'],
    isFeatured: true,
    isNew: false,
    rating: 4.9,
    reviewCount: 1234,
    category: 'Books',
    brand: 'Penguin Random House',
    stock: 150
  },

  // Sports & Fitness
  {
    sku: 'YOGA-001',
    name: 'Premium Yoga Mat 6mm',
    slug: 'premium-yoga-mat-6mm',
    description: 'Non-slip yoga mat with 6mm thickness for extra cushioning. Made from eco-friendly TPE material with carrying strap.',
    shortDescription: 'Non-slip yoga mat with extra cushioning',
    categoryId: 'sports',
    price: 1299,
    status: 'active',
    images: [
      { id: 'img12', url: '/images/yoga-mat-1.jpg', alt: 'Yoga Mat', position: 0, isDefault: true }
    ],
    variants: [],
    attributes: [
      { name: 'Thickness', value: '6mm', displayOrder: 1 },
      { name: 'Material', value: 'TPE (Eco-friendly)', displayOrder: 2 },
      { name: 'Size', value: '183cm x 61cm', displayOrder: 3 }
    ],
    inventory: {
      quantity: 100,
      lowStockThreshold: 20,
      trackInventory: true,
      allowBackorder: false,
      sku: 'YOGA-001'
    },
    tags: ['yoga', 'fitness', 'exercise', 'mat'],
    isFeatured: false,
    isNew: false,
    rating: 4.6,
    reviewCount: 234,
    category: 'Sports & Fitness',
    brand: 'Decathlon',
    stock: 100
  },

  // Additional products for pagination testing
  ...Array.from({ length: 40 }, (_, i) => ({
    sku: `PROD-${String(i + 100).padStart(3, '0')}`,
    name: `Sample Product ${i + 1}`,
    slug: `sample-product-${i + 1}`,
    description: `This is a sample product ${i + 1} for testing pagination and filtering. It includes all necessary details and specifications.`,
    shortDescription: `Sample product ${i + 1} for testing`,
    categoryId: ['electronics', 'fashion', 'home-kitchen', 'books', 'sports'][i % 5],
    price: Math.floor(Math.random() * 50000) + 1000,
    compareAtPrice: Math.floor(Math.random() * 60000) + 2000,
    status: 'active',
    images: [
      { id: `img${i + 100}`, url: `/images/sample-${i + 1}.jpg`, alt: `Sample Product ${i + 1}`, position: 0, isDefault: true }
    ],
    variants: [],
    attributes: [
      { name: 'Feature 1', value: `Value ${i + 1}`, displayOrder: 1 },
      { name: 'Feature 2', value: `Specification ${i + 1}`, displayOrder: 2 }
    ],
    inventory: {
      quantity: Math.floor(Math.random() * 100) + 10,
      lowStockThreshold: 10,
      trackInventory: true,
      allowBackorder: false,
      sku: `PROD-${String(i + 100).padStart(3, '0')}`
    },
    tags: ['sample', 'test', 'product'],
    isFeatured: i % 10 === 0,
    isNew: i % 5 === 0,
    rating: Math.floor(Math.random() * 20 + 30) / 10,
    reviewCount: Math.floor(Math.random() * 200),
    category: ['Electronics', 'Fashion', 'Home & Kitchen', 'Books', 'Sports & Fitness'][i % 5],
    brand: ['Brand A', 'Brand B', 'Brand C', 'Brand D', 'Brand E'][i % 5],
    stock: Math.floor(Math.random() * 100) + 10
  }))
];

async function seedProducts() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    console.log('Clearing existing products...');
    await Product.deleteMany({});
    console.log('Existing products cleared');

    console.log('Inserting mock products...');
    await Product.insertMany(mockProducts);
    console.log(`Successfully inserted ${mockProducts.length} products`);

    console.log('\nProduct Summary:');
    const categories = await Product.distinct('categoryId');
    for (const category of categories) {
      const count = await Product.countDocuments({ categoryId: category });
      console.log(`  ${category}: ${count} products`);
    }

    console.log('\nSeed completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding products:', error);
    process.exit(1);
  }
}

seedProducts();

// Made with Bob
