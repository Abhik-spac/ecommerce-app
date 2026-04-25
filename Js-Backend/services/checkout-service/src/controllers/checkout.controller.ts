import { Request, Response } from 'express';
import axios from 'axios';

export class CheckoutController {
  async initiateCheckout(req: Request, res: Response) {
    try {
      const { userId, cartId, shippingAddress, billingAddress } = req.body;
      
      // Validate cart
      const cartResponse = await axios.get(`http://localhost:3003/api/v1/cart`, {
        headers: { 'x-user-id': userId }
      });
      
      const cart = cartResponse.data.data;
      
      if (!cart.items || cart.items.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Cart is empty'
        });
      }
      
      // Create checkout session
      const checkoutSession = {
        id: `checkout_${Date.now()}`,
        userId,
        cart,
        shippingAddress,
        billingAddress,
        status: 'PENDING',
        createdAt: new Date(),
        expiresAt: new Date(Date.now() + 30 * 60 * 1000), // 30 minutes
      };
      
      res.json({
        success: true,
        data: checkoutSession,
      });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
  
  async processPayment(req: Request, res: Response) {
    try {
      const { checkoutId, paymentMethod, paymentDetails } = req.body;
      
      // Simulate payment processing
      const paymentResult = {
        transactionId: `txn_${Date.now()}`,
        status: 'SUCCESS',
        amount: paymentDetails.amount,
        currency: 'INR',
        paymentMethod,
        processedAt: new Date(),
      };
      
      // Create order after successful payment
      const orderResponse = await axios.post('http://localhost:3005/api/v1/orders', {
        checkoutId,
        paymentResult,
        ...req.body,
      });
      
      res.json({
        success: true,
        data: {
          payment: paymentResult,
          order: orderResponse.data.data,
        },
      });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
  
  async validateAddress(req: Request, res: Response) {
    try {
      const { address } = req.body;
      
      // Basic address validation
      const isValid = address.street && address.city && address.state && address.pincode;
      
      res.json({
        success: true,
        data: {
          isValid,
          normalizedAddress: isValid ? address : null,
        },
      });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
}

// Made with Bob
