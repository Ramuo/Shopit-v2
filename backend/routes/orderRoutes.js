import express from 'express';
import {
    newOrder,
    myOrders,
    getOrderDetails,
    updateOrder,
    deleteOrder,
    allOrders
} from '../controllers/orderControllers.js';
import {protect, authorize} from '../middlewares/authMiddleware.js';
import checkObjectId from "../middlewares/checkObjectId.js"




const router = express.Router();

router.route('/').get(protect, authorize("admin"), allOrders);
router.route('/new').post(protect, newOrder);
router.route('/mine').get(protect, myOrders);
router.route('/:id')
    .get(protect, checkObjectId, getOrderDetails)
    .put(protect, authorize('admin'), checkObjectId, updateOrder )
    .delete(protect, authorize('admin'), checkObjectId, deleteOrder );


export default router;