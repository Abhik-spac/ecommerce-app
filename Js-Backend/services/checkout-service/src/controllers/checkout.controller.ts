import { Request, Response } from 'express';
import axios from 'axios';
import { CheckoutSession } from '../models/checkout-session.model';

const CART_SERVICE_URL = process.env.CART_SERVICE_URL!;
const ORDER_SERVICE_URL = process.env.ORDER_SERVICE_URL!;

export class CheckoutController {
  // Save or update checkout session
  async saveSession(req: Request, res: Response) {
    try {
      const userId = req.headers['x-user-id'] as string;
      const guestId = req.headers['x-guest-id'] as string;
      
      if (!userId && !guestId) {
        return res.status(400).json({
          success: false,
          message: 'User ID or Guest ID is required'
        });
      }

      const {
        currentStep,
        shippingAddress,
        billingAddress,
        paymentMethod,
        cartSnapshot,
        totalAmount
      } = req.body;

      // Find existing session or create new one
      const query = userId ? { userId, status: 'IN_PROGRESS' } : { guestId, status: 'IN_PROGRESS' };
      let session = await CheckoutSession.findOne(query);

      if (session) {
        // Update existing session
        session.currentStep = currentStep || session.currentStep;
        session.shippingAddress = shippingAddress || session.shippingAddress;
        session.billingAddress = billingAddress || session.billingAddress;
        session.paymentMethod = paymentMethod || session.paymentMethod;
        session.cartSnapshot = cartSnapshot || session.cartSnapshot;
        session.totalAmount = totalAmount || session.totalAmount;
        session.expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // Extend expiry
        await session.save();
      } else {
        // Create new session
        session = await CheckoutSession.create({
          userId,
          guestId,
          currentStep: currentStep || 1,
          shippingAddress,
          billingAddress,
          paymentMethod,
          cartSnapshot,
          totalAmount
        });
      }

      res.json({
        success: true,
        data: session,
        message: 'Checkout session saved successfully'
      });
    } catch (error: any) {
      console.error('Save session error:', error);
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // Get checkout session
  async getSession(req: Request, res: Response) {
    try {
      const userId = req.headers['x-user-id'] as string;
      const guestId = req.headers['x-guest-id'] as string;

      if (!userId && !guestId) {
        return res.status(400).json({
          success: false,
          message: 'User ID or Guest ID is required'
        });
      }

      const query = userId ? { userId, status: 'IN_PROGRESS' } : { guestId, status: 'IN_PROGRESS' };
      const session = await CheckoutSession.findOne(query).sort({ updatedAt: -1 });

      if (!session) {
        return res.json({
          success: true,
          data: null,
          message: 'No active checkout session found'
        });
      }

      res.json({
        success: true,
        data: session
      });
    } catch (error: any) {
      console.error('Get session error:', error);
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // Clear/abandon checkout session
  async clearSession(req: Request, res: Response) {
    try {
      const userId = req.headers['x-user-id'] as string;
      const guestId = req.headers['x-guest-id'] as string;

      if (!userId && !guestId) {
        return res.status(400).json({
          success: false,
          message: 'User ID or Guest ID is required'
        });
      }

      const query = userId ? { userId, status: 'IN_PROGRESS' } : { guestId, status: 'IN_PROGRESS' };
      
      // Mark sessions as COMPLETED instead of deleting
      // This preserves data for logging, analytics, and reporting
      // The getSession query only looks for IN_PROGRESS sessions, so completed ones won't be restored
      await CheckoutSession.updateMany(query, {
        status: 'COMPLETED',
        completedAt: new Date()
      });

      res.json({
        success: true,
        message: 'Checkout session cleared successfully'
      });
    } catch (error: any) {
      console.error('Clear session error:', error);
      res.status(500).json({ success: false, message: error.message });
    }
  }

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
