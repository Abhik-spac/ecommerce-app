import { Router } from 'express';
import { CheckoutController } from '../controllers/checkout.controller';

const router = Router();
const controller = new CheckoutController();

router.post('/initiate', (req, res) => controller.initiateCheckout(req, res));
router.post('/payment', (req, res) => controller.processPayment(req, res));
router.post('/validate-address', (req, res) => controller.validateAddress(req, res));

export default router;

// Made with Bob
