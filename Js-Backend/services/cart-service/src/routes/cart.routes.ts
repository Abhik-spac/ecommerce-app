import { Router } from 'express';
import { getCart, addToCart, updateCartItem, removeFromCart, clearCart, mergeGuestCart } from '../controllers/cart.controller';
import { authenticate, authenticateOrGuest } from '../middleware/auth.middleware';

const router = Router();

// Cart operations (allow both users and guests)
router.get('/', authenticateOrGuest, getCart);
router.post('/items', authenticateOrGuest, addToCart);
router.put('/items/:productId', authenticateOrGuest, updateCartItem);
router.delete('/items/:productId', authenticateOrGuest, removeFromCart);
router.delete('/', authenticateOrGuest, clearCart);

// Merge guest cart (requires authenticated user)
router.post('/merge', authenticate, mergeGuestCart);

export default router;

// Made with Bob
