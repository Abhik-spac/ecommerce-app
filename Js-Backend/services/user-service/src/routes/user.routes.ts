import { Router } from 'express';
import { UserController } from '../controllers/user.controller';

const router = Router();
const controller = new UserController();

router.get('/profile', (req, res) => controller.getProfile(req, res));
router.put('/profile', (req, res) => controller.updateProfile(req, res));

// Address routes
router.get('/addresses', (req, res) => controller.getAddresses(req, res));
router.post('/addresses', (req, res) => controller.addAddress(req, res));
router.put('/addresses/:addressId', (req, res) => controller.updateAddress(req, res));
router.delete('/addresses/:addressId', (req, res) => controller.deleteAddress(req, res));
router.patch('/addresses/:addressId/default', (req, res) => controller.setDefaultAddress(req, res));

router.put('/preferences', (req, res) => controller.updatePreferences(req, res));

// Wishlist routes
router.get('/wishlist', (req, res) => controller.getWishlist(req, res));
router.post('/wishlist', (req, res) => controller.addToWishlist(req, res));
router.delete('/wishlist/:productId', (req, res) => controller.removeFromWishlist(req, res));
router.post('/wishlist/toggle', (req, res) => controller.toggleWishlist(req, res));
router.post('/wishlist/merge', (req, res) => controller.mergeWishlist(req, res));
router.delete('/wishlist', (req, res) => controller.clearWishlist(req, res));

export default router;

// Made with Bob
