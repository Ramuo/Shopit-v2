import express from "express";
import {
    newProduct,
    getProducts,
    getProductDetails,
    updateProduct,
    deleteProduct,
} from '../controllers/productControllers.js'
import checkObjectId from '../middlewares/checkObjectId.js';


const router = express.Router()


router.route('/').post(newProduct)
router.route('/').get(getProducts)
router.route('/:id')
    .get(checkObjectId, getProductDetails)
    .put(checkObjectId, updateProduct)
    .delete(checkObjectId, deleteProduct)

export default router