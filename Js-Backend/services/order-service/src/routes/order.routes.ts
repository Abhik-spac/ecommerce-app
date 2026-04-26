import { Router } from 'express';
import { OrderController } from '../controllers/order.controller';

const router = Router();
const controller = new OrderController();

router.post('/', (req, res) => controller.createOrder(req, res));
router.post('/track', (req, res) => controller.trackGuestOrder(req, res));
router.get('/', (req, res) => controller.getOrders(req, res));
router.get('/:id', (req, res) => controller.getOrderById(req, res));

export default router;

// Made with Bob
