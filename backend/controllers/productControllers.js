import Product from '../models/poroductModel.js';
import asyncHandler from '../middlewares/asyncHandler.js'
import APIFilters from '../utils/APIfilters.js';



//@desc   Gell all Product
//@route  GET /api/products
//@access Private/Admin
// const getProducts = asyncHandler (async (req, res) => {
//    const product = await Product.find();

//    res.status(200).json({
//     product
//    })
// });


//@desc   Gell all Product
//@route  GET /api/products
//@access Private/Admin
const getProducts = asyncHandler (async (req, res) => {
    
    const resPerPage = 4;

    const apiFilters = new APIFilters(Product, req.query).search().filters()
   
    let products = await apiFilters.query;
    let filteredProductsCount = products.length;

    apiFilters.pegination(resPerPage);
    products = await apiFilters.query.clone();
   
   res.status(200).json({
    resPerPage,
    filteredProductsCount,
    products
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
    const product = await Product.findById(req.params.id);

    if(!product){
        res.status(404);
        throw new Error("Aucun produit trouvé")
    }else{
        res.status(200).json({
            product 
        })
    }
});

//@desc    Update Product 
//@route   PUT api/product/:id
//@access  Public
const updateProduct = asyncHandler (async (req, res) => {
    let product = await Product.findById(req.params.id);

    if(!product){
        res.status(404);
        throw new Error("Aucun produit trouvé")
    }

    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
        new: true
    });

    res.status(200).json({
        product
    });
});


//@desc     Delete Product
//@route    DELETE api/products/:id
//@access   Private/Admin
const deleteProduct = asyncHandler(async(req, res) => {
    const product = await Product.findById(req.params.id);

    if(!product){
        res.status(404);
        throw new Error(" Aucun Produit trouvé")
    }

    await product.deleteOne();

    res.status(200).json({
        message: 'Produit supprimé'
    });
});



export {
    newProduct,
    getProducts,
    getProductDetails,
    updateProduct,
    deleteProduct,
}