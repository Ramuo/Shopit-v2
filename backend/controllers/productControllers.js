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
    req.body.user = req.user._id;
    
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

//@desc     Create a new review for product
//@route    PUT api/products/reviews
//@access   Private
const createProductReview = asyncHandler(async(req, res) => {
    
    //1- Let's get the rating and the comment from body
    const {rating, comment} = req.body;

    //2- Let'us get the product
    const product = await Product.findById(req.params.id);

    //3- Let's check if the product was already reviewed
    if(product){
        const alreadyReviewed = product.reviews.find(
            (review) => review.user.toString() === req.user._id.toString()
        );

        if(alreadyReviewed){
            res.status(400);
            throw new Error("Vous avez déjà laissé un avis");
        };

        //- Create a review object
        const review = {
            name: req.user.name,
            rating: Number(rating),
            comment,
            user: req.user._id
        };

        //Let' us push the created review to review collection
        product.reviews.push(review);

        //Let's set numReviews = to product reviews length
        product.numReviews = product.reviews.length;

        //To GET the rating, add ratings with reduce then divide it by the reviews lenght
        product.rating =
            product.reviews.reduce((acc, review) => acc + review.rating, 0) / product.reviews.length;

        await product.save();
        res.status(201).json({message: 'Avis ajouté'});
        
    }else{
        res.status(404);
        throw new Error('Produit non trouvé');
    }
});

// @desc   Get Product Reviews
// @route  GET /api/products
// @access Private/Admin
const getProductReviews = asyncHandler (async (req, res) => {
    const product = await Product.findById(req.query.id);

    // .populate("reviews.user")

    if (!product) {
        res.status(404);
        throw new Error('Produit non trouvé');
    }
  
    res.status(200).json({
      reviews: product.reviews,
    })
});
// @desc   Delete Reviews
// @route  DELETE /api/products/reviews
// @access Private/Admin
const deleteReview = asyncHandler (async (req, res) => {
    let product = await Product.findById(req.query.productId);

    if (!product) {
    res.status(404);
    throw new Error('Produit non trouvé');
    }

    const reviews = product?.reviews?.filter(
    (review) => review._id.toString() !== req?.query?.id.toString()
    );

    const numOfReviews = reviews.length;

    const ratings =
    numOfReviews === 0
        ? 0
        : product.reviews.reduce((acc, item) => item.rating + acc, 0) /
        numOfReviews;

    product = await Product.findByIdAndUpdate(
    req.query.productId,
    { reviews, numOfReviews, ratings },
    { new: true }
    );

    res.status(200).json({
    success: true,
    product,
    });
});


export {
    newProduct,
    getProducts,
    getProductDetails,
    updateProduct,
    deleteProduct,
    createProductReview,
    getProductReviews,
    deleteReview,
}