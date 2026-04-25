import { redis } from '../index';

export class CartService {
  async getCart(userId: string) {
    const key = `cart:${userId}`;
    const data = await redis.get(key);
    return data ? JSON.parse(data) : { items: [], pricing: {} };
  }
  
  async addItem(userId: string, item: any) {
    const cart = await this.getCart(userId);
    const existingIndex = cart.items.findIndex((i: any) => i.productId === item.productId);
    
    if (existingIndex >= 0) {
      cart.items[existingIndex].quantity += item.quantity;
    } else {
      cart.items.push(item);
    }
    
    cart.pricing = this.calculatePricing(cart.items);
    await this.saveCart(userId, cart);
    return cart;
  }
  
  private calculatePricing(items: any[]) {
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
  
  private async saveCart(userId: string, cart: any) {
    const key = `cart:${userId}`;
    await redis.setEx(key, 86400, JSON.stringify(cart));
  }
}

// Made with Bob
