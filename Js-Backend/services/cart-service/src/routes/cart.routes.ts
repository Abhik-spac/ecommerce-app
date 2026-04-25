import { Router } from 'express';
import { getCart, addToCart, updateCartItem, removeFromCart, clearCart } from '../controllers/cart.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

// All cart routes require authentication
router.use(authenticate);

router.get('/', getCart);
router.post('/items', addToCart);
router.put('/items/:productId', updateCartItem);
router.delete('/items/:productId', removeFromCart);
router.delete('/', clearCart);

export default router;

// Made with Bob
