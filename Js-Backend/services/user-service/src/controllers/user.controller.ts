import { Request, Response } from 'express';
import { UserProfile } from '../models/UserProfile';

export class UserController {
  async getProfile(req: Request, res: Response) {
    try {
      const userId = req.headers['x-user-id'];
      
      const profile = await UserProfile.findOne({ userId });
      
      if (!profile) {
        return res.status(404).json({
          success: false,
          message: 'Profile not found',
        });
      }
      
      res.json({ success: true, data: profile });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
  
  async updateProfile(req: Request, res: Response) {
    try {
      const userId = req.headers['x-user-id'];
      const updates = req.body;
      
      let profile = await UserProfile.findOne({ userId });
      
      if (!profile) {
        profile = await UserProfile.create({ userId, ...updates });
      } else {
        Object.assign(profile, updates);
        await profile.save();
      }
      
      res.json({ success: true, data: profile });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
  
  async addAddress(req: Request, res: Response) {
    try {
      const userId = req.headers['x-user-id'];
      const address = req.body;
      
      // Validate required fields
      if (!address.type || !address.street || !address.city || !address.state || !address.pincode) {
        return res.status(400).json({
          success: false,
          message: 'Address must include: type, street, city, state, and pincode'
        });
      }
      
      let profile = await UserProfile.findOne({ userId });
      
      if (!profile) {
        profile = await UserProfile.create({
          userId,
          addresses: [address],
        });
      } else {
        // If this is set as default, unset other defaults
        if (address.isDefault) {
          profile.addresses.forEach(addr => addr.isDefault = false);
        }
        
        profile.addresses.push(address);
        await profile.save();
      }
      
      res.json({
        success: true,
        data: profile.addresses,
        message: 'Address added successfully'
      });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
  
  async getAddresses(req: Request, res: Response) {
    try {
      const userId = req.headers['x-user-id'];
      
      const profile = await UserProfile.findOne({ userId });
      
      res.json({
        success: true,
        data: profile?.addresses || [],
      });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
  
  async updateAddress(req: Request, res: Response) {
    try {
      const userId = req.headers['x-user-id'];
      const { addressId } = req.params;
      const updates = req.body;
      
      const profile = await UserProfile.findOne({ userId });
      
      if (!profile) {
        return res.status(404).json({
          success: false,
          message: 'Profile not found'
        });
      }
      
      const addressIndex = profile.addresses.findIndex(
        addr => addr._id?.toString() === addressId
      );
      
      if (addressIndex === -1) {
        return res.status(404).json({
          success: false,
          message: 'Address not found'
        });
      }
      
      // If setting as default, unset other defaults
      if (updates.isDefault) {
        profile.addresses.forEach((addr, idx) => {
          if (idx !== addressIndex) {
            addr.isDefault = false;
          }
        });
      }
      
      Object.assign(profile.addresses[addressIndex], updates);
      await profile.save();
      
      res.json({
        success: true,
        data: profile.addresses,
        message: 'Address updated successfully'
      });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
  
  async deleteAddress(req: Request, res: Response) {
    try {
      const userId = req.headers['x-user-id'];
      const { addressId } = req.params;
      
      const profile = await UserProfile.findOne({ userId });
      
      if (!profile) {
        return res.status(404).json({
          success: false,
          message: 'Profile not found'
        });
      }
      
      const addressIndex = profile.addresses.findIndex(
        addr => addr._id?.toString() === addressId
      );
      
      if (addressIndex === -1) {
        return res.status(404).json({
          success: false,
          message: 'Address not found'
        });
      }
      
      profile.addresses.splice(addressIndex, 1);
      await profile.save();
      
      res.json({
        success: true,
        data: profile.addresses,
        message: 'Address deleted successfully'
      });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
  
  async setDefaultAddress(req: Request, res: Response) {
    try {
      const userId = req.headers['x-user-id'];
      const { addressId } = req.params;
      
      const profile = await UserProfile.findOne({ userId });
      
      if (!profile) {
        return res.status(404).json({
          success: false,
          message: 'Profile not found'
        });
      }
      
      const addressIndex = profile.addresses.findIndex(
        addr => addr._id?.toString() === addressId
      );
      
      if (addressIndex === -1) {
        return res.status(404).json({
          success: false,
          message: 'Address not found'
        });
      }
      
      // Unset all defaults
      profile.addresses.forEach(addr => addr.isDefault = false);
      
      // Set this as default
      profile.addresses[addressIndex].isDefault = true;
      await profile.save();
      
      res.json({
        success: true,
        data: profile.addresses,
        message: 'Default address updated successfully'
      });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
  
  async updatePreferences(req: Request, res: Response) {
    try {
      const userId = req.headers['x-user-id'];
      const preferences = req.body;
      
      const profile = await UserProfile.findOneAndUpdate(
        { userId },
        { $set: { preferences } },
        { new: true, upsert: true }
      );
      
      res.json({ success: true, data: profile });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
  
  async getWishlist(req: Request, res: Response) {
    try {
      const userId = req.headers['x-user-id'];
      
      const profile = await UserProfile.findOne({ userId });
      
      res.json({
        success: true,
        data: profile?.wishlist || [],
      });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
  
  async addToWishlist(req: Request, res: Response) {
    try {
      const userId = req.headers['x-user-id'];
      const { productId } = req.body;
      
      if (!productId) {
        return res.status(400).json({
          success: false,
          message: 'Product ID is required',
        });
      }
      
      let profile = await UserProfile.findOne({ userId });
      
      if (!profile) {
        profile = await UserProfile.create({
          userId,
          wishlist: [productId],
        });
      } else {
        // Check if product already in wishlist
        if (profile.wishlist.includes(productId)) {
          return res.status(400).json({
            success: false,
            message: 'Product already in wishlist',
          });
        }
        
        profile.wishlist.push(productId);
        await profile.save();
      }
      
      res.json({
        success: true,
        message: 'Product added to wishlist',
        data: profile.wishlist,
      });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
  
  async removeFromWishlist(req: Request, res: Response) {
    try {
      const userId = req.headers['x-user-id'];
      const { productId } = req.params;
      
      const profile = await UserProfile.findOne({ userId });
      
      if (!profile) {
        return res.status(404).json({
          success: false,
          message: 'Profile not found',
        });
      }
      
      profile.wishlist = profile.wishlist.filter(id => id !== productId);
      await profile.save();
      
      res.json({
        success: true,
        message: 'Product removed from wishlist',
        data: profile.wishlist,
      });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
  
  async toggleWishlist(req: Request, res: Response) {
    try {
      const userId = req.headers['x-user-id'];
      const { productId } = req.body;
      
      if (!userId) {
        return res.status(400).json({
          success: false,
          message: 'User ID is required',
        });
      }
      
      if (!productId) {
        return res.status(400).json({
          success: false,
          message: 'Product ID is required',
        });
      }
      
      let profile = await UserProfile.findOne({ userId });
      
      if (!profile) {
        profile = await UserProfile.create({
          userId,
          wishlist: [productId],
        });
        
        return res.json({
          success: true,
          message: 'Product added to wishlist',
          data: { wishlist: profile.wishlist, isInWishlist: true },
        });
      }
      
      const index = profile.wishlist.indexOf(productId);
      
      if (index > -1) {
        // Remove from wishlist
        profile.wishlist.splice(index, 1);
        await profile.save();
        
        return res.json({
          success: true,
          message: 'Product removed from wishlist',
          data: { wishlist: profile.wishlist, isInWishlist: false },
        });
      } else {
        // Add to wishlist
        profile.wishlist.push(productId);
        await profile.save();
        
        return res.json({
          success: true,
          message: 'Product added to wishlist',
          data: { wishlist: profile.wishlist, isInWishlist: true },
        });
      }
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
  
  async clearWishlist(req: Request, res: Response) {
    try {
      const userId = req.headers['x-user-id'];
      
      const profile = await UserProfile.findOneAndUpdate(
        { userId },
        { $set: { wishlist: [] } },
        { new: true }
      );
      
      res.json({
        success: true,
        message: 'Wishlist cleared',
        data: [],
      });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
  
  async mergeWishlist(req: Request, res: Response) {
    try {
      const userId = req.headers['x-user-id'];
      const { guestId } = req.body;
      
      if (!guestId) {
        return res.status(400).json({
          success: false,
          message: 'Guest ID is required',
        });
      }
      
      // Get guest wishlist
      const guestProfile = await UserProfile.findOne({ userId: guestId });
      const guestWishlist = guestProfile?.wishlist || [];
      
      // Get or create user profile
      let userProfile = await UserProfile.findOne({ userId });
      
      if (!userProfile) {
        // Create new profile with guest wishlist
        userProfile = await UserProfile.create({
          userId,
          wishlist: guestWishlist,
        });
      } else {
        // Merge guest wishlist with existing wishlist (avoid duplicates)
        const existingWishlist = new Set(userProfile.wishlist);
        guestWishlist.forEach(id => existingWishlist.add(id));
        userProfile.wishlist = Array.from(existingWishlist);
        await userProfile.save();
      }
      
      // Optionally delete guest wishlist after merge
      if (guestProfile) {
        guestProfile.wishlist = [];
        await guestProfile.save();
      }
      
      res.json({
        success: true,
        message: 'Wishlist merged successfully',
        data: userProfile.wishlist,
      });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
}

// Made with Bob
