import { Request, Response } from 'express';
import { CartService } from '../services/cart.service';

const cartService = new CartService();

export const getCart = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id || req.headers['x-user-id'] as string;
    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }
    
    const cart = await cartService.getCart(userId);
    res.json(cart);
  } catch (error) {
    console.error('Get cart error:', error);
    res.status(500).json({ error: 'Failed to retrieve cart' });
  }
};

export const addToCart = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id || req.headers['x-user-id'] as string;
    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }
    
    const { productId, name, price, quantity, image } = req.body;
    
    if (!productId || !name || !price || !quantity) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    const item = { productId, name, price, quantity, image };
    const cart = await cartService.addItem(userId, item);
    
    res.json(cart);
  } catch (error) {
    console.error('Add to cart error:', error);
    res.status(500).json({ error: 'Failed to add item to cart' });
  }
};

export const updateCartItem = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id || req.headers['x-user-id'] as string;
    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }
    
    const { productId } = req.params;
    const { quantity } = req.body;
    
    if (!quantity || quantity < 0) {
      return res.status(400).json({ error: 'Invalid quantity' });
    }
    
    const cart = await cartService.getCart(userId);
    const itemIndex = cart.items.findIndex((i: any) => i.productId === productId);
    
    if (itemIndex === -1) {
      return res.status(404).json({ error: 'Item not found in cart' });
    }
    
    if (quantity === 0) {
      cart.items.splice(itemIndex, 1);
    } else {
      cart.items[itemIndex].quantity = quantity;
    }
    
    cart.pricing = calculatePricing(cart.items);
    await saveCart(userId, cart);
    
    res.json(cart);
  } catch (error) {
    console.error('Update cart error:', error);
    res.status(500).json({ error: 'Failed to update cart' });
  }
};

export const removeFromCart = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id || req.headers['x-user-id'] as string;
    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }
    
    const { productId } = req.params;
    const cart = await cartService.getCart(userId);
    
    cart.items = cart.items.filter((i: any) => i.productId !== productId);
    cart.pricing = calculatePricing(cart.items);
    await saveCart(userId, cart);
    
    res.json(cart);
  } catch (error) {
    console.error('Remove from cart error:', error);
    res.status(500).json({ error: 'Failed to remove item from cart' });
  }
};

export const clearCart = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id || req.headers['x-user-id'] as string;
    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }
    
    const emptyCart = { items: [], pricing: {} };
    await saveCart(userId, emptyCart);
    
    res.json(emptyCart);
  } catch (error) {
    console.error('Clear cart error:', error);
    res.status(500).json({ error: 'Failed to clear cart' });
  }
};

export const mergeGuestCart = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;
    const userType = (req as any).user?.type;
    const { guestId } = req.body;
    
    if (!userId || userType !== 'user') {
      return res.status(403).json({ error: 'Only authenticated users can merge carts' });
    }
    
    if (!guestId) {
      return res.status(400).json({ error: 'Guest ID is required' });
    }
    
    // Get both carts
    const guestCart = await cartService.getCart(guestId);
    const userCart = await cartService.getCart(userId);
    
    // If guest cart is empty, just return user cart
    if (!guestCart.items || guestCart.items.length === 0) {
      return res.json(userCart);
    }
    
    // Merge items
    const mergedItems = [...(userCart.items || [])];
    
    for (const guestItem of guestCart.items) {
      const existingIndex = mergedItems.findIndex((i: any) => i.productId === guestItem.productId);
      if (existingIndex >= 0) {
        // Add quantities if item exists
        mergedItems[existingIndex].quantity += guestItem.quantity;
      } else {
        // Add new item
        mergedItems.push(guestItem);
      }
    }
    
    // Calculate pricing for merged cart
    const mergedCart = {
      items: mergedItems,
      pricing: calculatePricing(mergedItems)
    };
    
    // Save merged cart to user's cart
    await saveCart(userId, mergedCart);
    
    // Delete guest cart
    const { redis } = require('../index');
    await redis.del(`cart:${guestId}`);
    
    res.json(mergedCart);
  } catch (error) {
    console.error('Merge cart error:', error);
    res.status(500).json({ error: 'Failed to merge carts' });
  }
};

// Helper functions
function calculatePricing(items: any[]) {
  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tax = subtotal * 0.18;
  const shipping = subtotal > 500 ? 0 : 50;
  
  return {
    subtotal,
    tax,
    shipping,
    total: subtotal + tax + shipping,
    currency: 'INR',
  };
}

async function saveCart(userId: string, cart: any) {
  const { redis } = require('../index');
  const key = `cart:${userId}`;
  await redis.setEx(key, 86400, JSON.stringify(cart));
}

// Made with Bob
