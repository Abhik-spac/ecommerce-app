import { Request, Response } from 'express';
import Product from '../models/Product';

// Get all products with pagination and filters
export const getProducts = async (req: Request, res: Response) => {
  try {
    const {
      page = 1,
      limit = 20,
      category,
      brand,
      minPrice,
      maxPrice,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = req.query;

    const query: any = { isActive: true };

    // Filters
    if (category) query.category = category;
    if (brand) query.brand = brand;
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }
    if (search) {
      query.$text = { $search: search as string };
    }

    // Pagination
    const skip = (Number(page) - 1) * Number(limit);
    const sort: any = { [sortBy as string]: sortOrder === 'asc' ? 1 : -1 };

    const [products, total] = await Promise.all([
      Product.find(query).sort(sort).skip(skip).limit(Number(limit)),
      Product.countDocuments(query),
    ]);

    res.json({
      products,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
};

// Get product by ID
export const getProductById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json(product);
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({ error: 'Failed to fetch product' });
  }
};

// Create product (admin only)
export const createProduct = async (req: Request, res: Response) => {
  try {
    const productData = req.body;
    const product = new Product(productData);
    await product.save();

    res.status(201).json(product);
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({ error: 'Failed to create product' });
  }
};

// Update product (admin only)
export const updateProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const product = await Product.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json(product);
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({ error: 'Failed to update product' });
  }
};

// Delete product (admin only)
export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const product = await Product.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true }
    );

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ error: 'Failed to delete product' });
  }
};

// Update stock
export const updateStock = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    product.stock += quantity;
    if (product.stock < 0) {
      return res.status(400).json({ error: 'Insufficient stock' });
    }

    await product.save();
    res.json(product);
  } catch (error) {
    console.error('Update stock error:', error);
    res.status(500).json({ error: 'Failed to update stock' });
  }
};

// Get categories
export const getCategories = async (req: Request, res: Response) => {
  try {
    const categories = await Product.distinct('category', { isActive: true });
    res.json(categories);
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
};

// Get brands
export const getBrands = async (req: Request, res: Response) => {
  try {
    const brands = await Product.distinct('brand', { isActive: true });
    res.json(brands.filter(Boolean));
  } catch (error) {
    console.error('Get brands error:', error);
    res.status(500).json({ error: 'Failed to fetch brands' });
  }
};

// Made with Bob
