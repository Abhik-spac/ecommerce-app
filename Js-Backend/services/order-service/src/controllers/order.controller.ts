import { Request, Response } from 'express';
import { pool } from '../index';

export class OrderController {
  async createOrder(req: Request, res: Response) {
    try {
      const { userId, items, shippingAddress, billingAddress, paymentResult } = req.body;
      
      const client = await pool.connect();
      
      try {
        await client.query('BEGIN');
        
        // Calculate totals
        const subtotal = items.reduce((sum: number, item: any) => 
          sum + (item.price * item.quantity), 0
        );
        const tax = subtotal * 0.18;
        const shipping = subtotal > 500 ? 0 : 50;
        const total = subtotal + tax + shipping;
        
        // Insert order
        const orderResult = await client.query(
          `INSERT INTO orders (user_id, status, subtotal, tax, shipping, total, 
           shipping_address, billing_address, payment_status, payment_id, created_at)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, NOW())
           RETURNING *`,
          [
            userId,
            'PENDING',
            subtotal,
            tax,
            shipping,
            total,
            JSON.stringify(shippingAddress),
            JSON.stringify(billingAddress),
            paymentResult.status,
            paymentResult.transactionId,
          ]
        );
        
        const order = orderResult.rows[0];
        
        // Insert order items
        for (const item of items) {
          await client.query(
            `INSERT INTO order_items (order_id, product_id, quantity, price, total)
             VALUES ($1, $2, $3, $4, $5)`,
            [order.id, item.productId, item.quantity, item.price, item.price * item.quantity]
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
}

// Made with Bob
