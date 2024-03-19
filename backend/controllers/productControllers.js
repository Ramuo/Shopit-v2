import Product from '../models/poroductModel.js';
import Order from '../models/orderModel.js';
import asyncHandler from '../middlewares/asyncHandler.js'
// import APIFilters from '../utils/APIfilters.js';
import {upload_file} from '../utils/cloudinary.js'


class APIFilters {
    constructor(query, queryStr) {
        this.query = query;
        this.queryStr = queryStr
    };

    //SEARCH
    search() {
        const keyword = this.queryStr.keyword ? {
            name: {
                $regex: this.queryStr.keyword,
                $options: 'i'
            }
        } : {};

        this.query = this.query.find({...keyword});
        return this;
    };

    //FILTER
    filters() {
        const queryCopy = {...this.queryStr};

        //Remove fields (keyword)
        const fieldsToRemove = ["keyword", "page"];
        fieldsToRemove.forEach((el) => delete queryCopy[el]);

        // Advance filter for price, ratings etc
        let queryStr = JSON.stringify(queryCopy);
        queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (match) => `$${match}`);

        this.query = this.query.find(JSON.parse(queryStr));
        return this;
    };

    //PAGINATION
    pegination(resPerPage) {
        const currentPage = Number(this.queryStr.page) || 1;

        const skip = resPerPage * (currentPage - 1);

        this.query = this.query.limit(resPerPage).skip(skip); 

        return this;
    }
};


// export default APIFilters;


//@desc   Gell all Product
//@route  GET /api/products
//@access Private/Admin
// const getProducts = asyncHandler (async (req, res) => {
//    const product = await Product.find();

//    res.status(200).json({
//     product
//    })
// });


//@desc   Create Products
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
    const product = await Product.findById(req.params.id).populate('reviews.user');

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
    
    const { rating, comment, productId } = req.body;

    const review = {
    user: req?.user?._id,
    rating: Number(rating),
    comment,
    };

    const product = await Product.findById(productId);

    if (!product) {
        res.status(404);
        throw new Error(" Aucun Produit trouvé")
    }

    const isReviewed = product?.reviews?.find(
        (r) => r.user.toString() === req?.user?._id.toString()
    );

    if (isReviewed) {
    product.reviews.forEach((review) => {
        if (review?.user?.toString() === req?.user?._id.toString()) {
        review.comment = comment;
        review.rating = rating;
        }
    });
    } else {
    product.reviews.push(review);
    product.numOfReviews = product.reviews.length;
    }

    product.ratings =
    product.reviews.reduce((acc, item) => item.rating + acc, 0) /
    product.reviews.length;

    await product.save({ validateBeforeSave: false });

    res.status(200).json({
    success: true,
    });
});

// @desc   Get Product Reviews
// @route  GET /api/products
// @access Private/Admin
const getProductReviews = asyncHandler (async (req, res) => {
    const product = await Product.findById(req.query.id).populate("reviews.user");

    
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

// @desc   Allow user to review product only when they bought it
// @route  GET /api/products/can_review
// @access Private
const canReview = asyncHandler( async (req, res) => {
    const orders = await Order.find({
        user: req.user._id,
        "orderItems.product": req.query.productId,
    });

    if(orders.length === 0){
        return res.status(200).json({canReview: false});
    }

    res.status(200).json({
        canReview: true,
    })
})

//@desc     Get All Product
//@route    GET /api/product
//@access   Private/Admin
const getAllProducts = asyncHandler(async(req, res) => {
    const products = await Product.find({});

    res.status(200).json({products});
});

//@desc    Upload Product  images
//@route   PUT api/product/:id/upload_images
//@access  Private/admin
const uploadProductImages = asyncHandler (async (req, res) => {
    let product = await Product.findById(req?.params?.id);

    if (!product) {
        res.status(404);
        throw new Error(" Aucun Produit trouvé")
    }
  
    const uploader = async (image) => upload_file(image, "shopit/products");
  
    const urls = await Promise.all((req?.body?.images).map(uploader));

    console.log(urls)
  
    product?.images?.push(...urls);
    await product?.save();
  
    res.status(200).json({
      product,
    });
});

//@desc    delete Product  image
//@route   PUT api/products/:id/delete_images
//@access  Private/admin
const deleteProductImage = asyncHandler( async ( req, res ) => {
    let product = await Product.findById(req?.params?.id);

    if (!product) {
      return next(new ErrorHandler("Product not found", 404));
    }
  
    const isDeleted = await delete_file(req.body.imgId);
  
    if (isDeleted) {
      product.images = product?.images?.filter(
        (img) => img.public_id !== req.body.imgId
      );
  
      await product?.save();
    }
  
    res.status(200).json({
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
    canReview,
    getAllProducts,
    uploadProductImages,
    deleteProductImage
}