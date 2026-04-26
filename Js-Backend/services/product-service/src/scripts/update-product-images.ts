import mongoose from 'mongoose';
import Product from '../models/Product';

const MONGODB_URI = process.env.MONGODB_URI!;

// Real product images from Unsplash
const getImageUrl = (productName: string, category: string): string => {
  const name = productName.toLowerCase();
  
  // Map specific products to Unsplash images
  if (name.includes('iphone')) return 'https://images.unsplash.com/photo-1592286927505-4fd4d3b23365?w=600&h=400&fit=crop';
  if (name.includes('samsung') && name.includes('galaxy')) return 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=600&h=400&fit=crop';
  if (name.includes('pixel')) return 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=600&h=400&fit=crop';
  if (name.includes('macbook')) return 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&h=400&fit=crop';
  if (name.includes('dell') && name.includes('xps')) return 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=600&h=400&fit=crop';
  if (name.includes('airpods')) return 'https://images.unsplash.com/photo-1606841837239-c5a1a4a07af7?w=600&h=400&fit=crop';
  if (name.includes('sony') && name.includes('headphone')) return 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=600&h=400&fit=crop';
  if (name.includes('bose')) return 'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=600&h=400&fit=crop';
  if (name.includes('watch')) return 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=600&h=400&fit=crop';
  if (name.includes('ipad')) return 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&h=400&fit=crop';
  if (name.includes('kindle')) return 'https://images.unsplash.com/photo-1592496431122-2349e0fbc666?w=600&h=400&fit=crop';
  if (name.includes('camera')) return 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600&h=400&fit=crop';
  if (name.includes('nike')) return 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&h=400&fit=crop';
  if (name.includes('adidas')) return 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=600&h=400&fit=crop';
  if (name.includes('jacket')) return 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&h=400&fit=crop';
  if (name.includes('jeans')) return 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=600&h=400&fit=crop';
  if (name.includes('shirt')) return 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=600&h=400&fit=crop';
  if (name.includes('dress')) return 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600&h=400&fit=crop';
  if (name.includes('backpack')) return 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&h=400&fit=crop';
  if (name.includes('wallet')) return 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=600&h=400&fit=crop';
  
  // Category-based fallback images
  const categoryImages: { [key: string]: string } = {
    'Electronics': 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=600&h=400&fit=crop',
    'Fashion': 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=600&h=400&fit=crop',
    'Books': 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=600&h=400&fit=crop',
    'Home & Kitchen': 'https://images.unsplash.com/photo-1556911220-bff31c812dba?w=600&h=400&fit=crop',
    'Sports': 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=600&h=400&fit=crop'
  };
  
  return categoryImages[category] || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=400&fit=crop';
};

const updateProductImages = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    const products = await Product.find({});
    console.log(`Found ${products.length} products to update`);

    let updated = 0;
    for (const product of products) {
      const imageUrl = getImageUrl(product.name, product.category || 'General');
      
      product.images = [
        {
          id: `img-${product._id?.toString() || 'default'}`,
          url: imageUrl,
          alt: product.name,
          position: 0,
          isDefault: true
        }
      ];
      
      await product.save();
      updated++;
      
      if (updated % 10 === 0) {
        console.log(`Updated ${updated}/${products.length} products...`);
      }
    }

    console.log(`\nSuccessfully updated ${updated} products with placeholder images`);
    console.log('Image URLs use placehold.co service with category-based colors');
    
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('Error updating product images:', error);
    process.exit(1);
  }
};

updateProductImages();

// Made with Bob
