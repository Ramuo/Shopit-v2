import express from "express";
import {
    newProduct,
    getProducts,
    getProductDetails,
    updateProduct,
    deleteProduct,
    createProductReview,
    getProductReviews,
    deleteReview,
    canReview,
    getAllProducts
} from '../controllers/productControllers.js'
import checkObjectId from '../middlewares/checkObjectId.js';
import {protect, authorize} from '../middlewares/authMiddleware.js';


const router = express.Router()


router.route('/').get(getProducts)
router.route('/').post(protect, authorize("admin"), newProduct);
router.route('/reviews').get(protect, getProductReviews);
router.route('/reviews').put(protect, createProductReview);
router.route('/reviews').delete(protect, authorize("admin"), deleteReview)// to review
router.route('/can_review').get(protect, canReview);
router.route('/products').get(protect, authorize('admin'), getAllProducts)
router.route('/:id')
    .get(checkObjectId, getProductDetails)
    .put(protect, authorize("admin"), checkObjectId, updateProduct)
    .delete(protect, authorize("admin"), checkObjectId, deleteProduct)
// router.route('/:id/reviews').post(protect, checkObjectId, createProductReview);

export default router;