import express from "express";
import {
    newProduct,
    getProducts,
    getProductDetails,
    updateProduct,
    deleteProduct,
} from '../controllers/productControllers.js'
import checkObjectId from '../middlewares/checkObjectId.js';
import {protect, authorize} from '../middlewares/authMiddleware.js'


const router = express.Router()


router.route('/').get(getProducts)
router.route('/').post(protect, authorize("admin"), newProduct)
router.route('/:id')
    .get(checkObjectId, getProductDetails)
    .put(protect, authorize("admin"), checkObjectId, updateProduct)
    .delete(protect, authorize("admin"), checkObjectId, deleteProduct)

export default router;