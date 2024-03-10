import express from 'express';
import {
 stripeCheckoutSession,
 stripeWebHook
} from '../controllers/paymentController.js';
import {protect} from '../middlewares/authMiddleware.js';
// import checkObjectId from "../middlewares/checkObjectId.js"




const router = express.Router();

router.route('/checkout_session').post(protect,  stripeCheckoutSession);
router.route('/webhook').post(stripeWebHook);


export default router;