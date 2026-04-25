import { Request, Response } from 'express';
import axios from 'axios';

const CART_SERVICE_URL = process.env.CART_SERVICE_URL!;
const ORDER_SERVICE_URL = process.env.ORDER_SERVICE_URL!;

export class CheckoutController {
  async initiateCheckout(req: Request, res: Response) {
    try {
      const { userId, cartId, shippingAddress, billingAddress } = req.body;
      
      // Validate cart
      const cartResponse = await axios.get(`${CART_SERVICE_URL}/api/v1/cart`, {
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
      const { checkoutId, paymentMethod, paymentDetails, userType, guestData } = req.body;
      
      // Validate guest data if guest checkout
      if (userType === 'guest') {
        const validation = this.validateGuestData(guestData);
        if (!validation.isValid) {
          return res.status(400).json({
            success: false,
            message: validation.error
          });
        }
      }
      
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
      const orderResponse = await axios.post(`${ORDER_SERVICE_URL}/api/v1/orders`, {
        checkoutId,
        paymentResult,
        userType,
        guestData,
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
  
  private validateGuestData(guestData: any): { isValid: boolean; error?: string } {
    if (!guestData) {
      return { isValid: false, error: 'Guest data is required for guest checkout' };
    }
    
    const { name, email, mobile, address } = guestData;
    
    // Validate required fields
    if (!name || !email || !mobile || !address) {
      return {
        isValid: false,
        error: 'Guest checkout requires: name, email, mobile, and address'
      };
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return { isValid: false, error: 'Invalid email format' };
    }
    
    // Validate mobile format (10 digits)
    const mobileRegex = /^[0-9]{10}$/;
    if (!mobileRegex.test(mobile.replace(/\D/g, ''))) {
      return { isValid: false, error: 'Invalid mobile number (must be 10 digits)' };
    }
    
    // Validate address fields
    if (!address.street || !address.city || !address.state || !address.pincode) {
      return {
        isValid: false,
        error: 'Address must include: street, city, state, and pincode'
      };
    }
    
    // Validate pincode (6 digits)
    const pincodeRegex = /^[0-9]{6}$/;
    if (!pincodeRegex.test(address.pincode)) {
      return { isValid: false, error: 'Invalid pincode (must be 6 digits)' };
    }
    
    return { isValid: true };
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
