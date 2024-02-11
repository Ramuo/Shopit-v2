import Product from '../models/poroductModel.js';
import asyncHandler from '../middlewares/asyncHandler.js'



//@desc   Gell all Product
//@route  GET /api/products
//@access Private
const getProducts = asyncHandler (async (req, res) => {
   const product = await Product.find();

   res.status(200).json({
    product
   })
});

//@desc   Create Product
//@route  POST /api/products
//@access Private/Admin
const newProduct = asyncHandler (async (req, res) => {
    const product = await Product.create(req.body)

    res.status(201).json({
        product
    });
});

//@desc    Get Product details by id
//@route   GET api/product/:id
//@access  Public
const getProductDetails = asyncHandler (async (req, res) => {
    res.json('get product details')
});



export {
    newProduct,
    getProducts,
    getProductDetails
}