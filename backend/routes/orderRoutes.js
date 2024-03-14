import express from 'express';
import {
    newOrder,
    myOrders,
    getOrderDetails,
    updateOrder,
    deleteOrder,
    allOrders,
    // getAllOrders,
    getSales
} from '../controllers/orderControllers.js';
import {protect, authorize} from '../middlewares/authMiddleware.js';
import checkObjectId from "../middlewares/checkObjectId.js"




const router = express.Router();

router.route('/').get(protect, authorize("admin"), allOrders);
router.route('/new').post(protect, newOrder);
router.route('/orders')
    .get(protect, myOrders)
    // .get(protect, authorize('admin'), getAllOrders);
router.route('/get_sales').get(protect, authorize("admin"), getSales);
router.route('/:id')
    .get(protect, checkObjectId, getOrderDetails)
    .put(protect, authorize('admin'), checkObjectId, updateOrder )
    .delete(protect, authorize('admin'), checkObjectId, deleteOrder );


export default router;