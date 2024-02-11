import express from "express";
import {
    newProduct,
    getProducts,
    getProductDetails
} from '../controllers/productControllers.js'


const router = express.Router()


router.route('/').post(newProduct)
router.route('/').get(getProducts)
router.route('/:id').get(getProductDetails)

export default router