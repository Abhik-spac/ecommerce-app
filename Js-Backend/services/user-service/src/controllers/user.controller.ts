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
      
      let profile = await UserProfile.findOne({ userId });
      
      if (!profile) {
        profile = await UserProfile.create({
          userId,
          addresses: [address],
        });
      } else {
        profile.addresses.push(address);
        await profile.save();
      }
      
      res.json({ success: true, data: profile });
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
}

// Made with Bob
