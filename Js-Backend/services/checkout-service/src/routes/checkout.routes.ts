import { Router } from 'express';
import { CheckoutController } from '../controllers/checkout.controller';

const router = Router();
const controller = new CheckoutController();

// Session management
router.post('/session', (req, res) => controller.saveSession(req, res));
router.get('/session', (req, res) => controller.getSession(req, res));
router.delete('/session', (req, res) => controller.clearSession(req, res));

// Checkout flow
router.post('/initiate', (req, res) => controller.initiateCheckout(req, res));
router.post('/payment', (req, res) => controller.processPayment(req, res));
router.post('/validate-address', (req, res) => controller.validateAddress(req, res));

export default router;

// Made with Bob
