import { Router } from 'express';
import { UserController } from '../controllers/user.controller';

const router = Router();
const controller = new UserController();

router.get('/profile', (req, res) => controller.getProfile(req, res));
router.put('/profile', (req, res) => controller.updateProfile(req, res));
router.get('/addresses', (req, res) => controller.getAddresses(req, res));
router.post('/addresses', (req, res) => controller.addAddress(req, res));
router.put('/preferences', (req, res) => controller.updatePreferences(req, res));

export default router;

// Made with Bob
