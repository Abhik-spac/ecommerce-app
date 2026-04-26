import { Request, Response } from 'express';
import { pool } from '../index';

export class OrderController {
  async createOrder(req: Request, res: Response) {
    try {
      const { items, shippingAddress, paymentMethod, subtotal, tax, total } = req.body;
      
      // Get userId or guestId from headers
      const userId = req.headers['x-user-id'] as string;
      const guestId = req.headers['x-guest-id'] as string;
      
      const client = await pool.connect();
      
      try {
        await client.query('BEGIN');
        
        // Calculate shipping
        const shipping = subtotal > 500 ? 0 : 50;
        const finalTotal = subtotal + tax + shipping;
        
        // Determine payment status based on method
        const paymentStatus = paymentMethod === 'cod' ? 'PENDING' : 'PAID';
        
        // Insert order
        const orderResult = await client.query(
          `INSERT INTO orders (user_id, guest_id, status, subtotal, tax, shipping, total,
           shipping_address, billing_address, payment_method, payment_status, payment_id, created_at)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, NOW())
           RETURNING *`,
          [
            userId || null,
            guestId || null,
            'PENDING',
            subtotal,
            tax,
            shipping,
            finalTotal,
            JSON.stringify(shippingAddress),
            JSON.stringify(shippingAddress), // Use shipping as billing for now
            paymentMethod,
            paymentStatus,
            null, // payment_id will be set later for online payments
          ]
        );
        
        const order = orderResult.rows[0];
        
        // Insert order items
        for (const item of items) {
          await client.query(
            `INSERT INTO order_items (order_id, product_id, product_name, quantity, price, total)
             VALUES ($1, $2, $3, $4, $5, $6)`,
            [order.id, item.productId, item.name || 'Unknown Product', item.quantity, item.price, item.price * item.quantity]
          );
        }
        
        await client.query('COMMIT');
        
        res.status(201).json({
          success: true,
          data: {
            id: order.id,
            orderNumber: `ORD-${order.id}`,
            status: order.status,
            total: order.total,
            createdAt: order.created_at,
          },
        });
      } catch (error) {
        await client.query('ROLLBACK');
        throw error;
      } finally {
        client.release();
      }
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
  
  async getOrders(req: Request, res: Response) {
    try {
      const userId = req.headers['x-user-id'];
      const { page = 1, limit = 10 } = req.query;
      
      const offset = (Number(page) - 1) * Number(limit);
      
      const result = await pool.query(
        `SELECT * FROM orders 
         WHERE user_id = $1 
         ORDER BY created_at DESC 
         LIMIT $2 OFFSET $3`,
        [userId, limit, offset]
      );
      
      const countResult = await pool.query(
        'SELECT COUNT(*) FROM orders WHERE user_id = $1',
        [userId]
      );
      
      res.json({
        success: true,
        data: result.rows,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total: Number(countResult.rows[0].count),
          totalPages: Math.ceil(Number(countResult.rows[0].count) / Number(limit)),
        },
      });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
  
  async getOrderById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      
      const orderResult = await pool.query(
        'SELECT * FROM orders WHERE id = $1',
        [id]
      );
      
      if (orderResult.rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Order not found',
        });
      }
      
      const itemsResult = await pool.query(
        'SELECT * FROM order_items WHERE order_id = $1',
        [id]
      );
      
      res.json({
        success: true,
        data: {
          ...orderResult.rows[0],
          items: itemsResult.rows,
        },
      });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async trackGuestOrder(req: Request, res: Response) {
    try {
      const { email, phone } = req.body;
      
      // Validate input - require at least email or phone
      if (!email && !phone) {
        return res.status(400).json({
          success: false,
          message: 'Either email or phone number is required',
        });
      }
      
      // Query all guest orders with shipping address containing email or phone
      const orderResult = await pool.query(
        `SELECT o.*,
         (SELECT json_agg(oi.*) FROM order_items oi WHERE oi.order_id = o.id) as items
         FROM orders o
         WHERE o.guest_id IS NOT NULL
         AND (
           o.shipping_address::jsonb->>'email' = $1
           OR o.shipping_address::jsonb->>'phone' = $2
         )
         ORDER BY o.created_at DESC`,
        [email || '', phone || '']
      );
      
      if (orderResult.rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'No orders found for the provided contact information.',
        });
      }
      
      // Parse JSON fields for all orders
      const orders = orderResult.rows.map(order => {
        if (typeof order.shipping_address === 'string') {
          order.shipping_address = JSON.parse(order.shipping_address);
        }
        if (typeof order.billing_address === 'string') {
          order.billing_address = JSON.parse(order.billing_address);
        }
        return order;
      });
      
      res.json({
        success: true,
        data: orders,
        count: orders.length,
      });
    } catch (error: any) {
      console.error('Track guest orders error:', error);
      res.status(500).json({ success: false, message: error.message });
    }
  }
}

// Made with Bob
