import Order from '../models/orderModel.js';
import Product from '../models/poroductModel.js';
import asyncHandler from '../middlewares/asyncHandler.js';


//@desc     Create Order
//@route    POST /api/orders/new
//@access   Private
const newOrder = asyncHandler(async (req, res) => {
    const {
        orderItems,
        shippingInfo,
        itemsPrice,
        taxAmount,
        shippingAmount,
        totalAmount,
        paymentMethod,
        paymentInfo,
    } = req.body;

    const order = await Order.create({
        orderItems,
        shippingInfo,
        itemsPrice,
        taxAmount,
        shippingAmount,
        totalAmount,
        paymentMethod,
        paymentInfo,
        user: req.user._id,
    });

    res.status(201).json({
        order
    })
});

//@desc     Get All orders
//@route    GET /api/orders
//@access   Private/Admin
const allOrders = asyncHandler(async(req, res) => {
    const orders = await Order.find();

    res.status(200).json({
        orders,
    });
});


//@desc     Get Logged in user orders 
//@route    GET /api/orders/mine
//@access   Private
const myOrders = asyncHandler(async (req, res) => {
    const orders = await Order.find({ user: req.user._id });

    res.status(200).json({
        orders,
    });
});

//@desc     Get Order details  By ID
//@route    GET /api/orders/:id
//@access   Private
const getOrderDetails = asyncHandler(async(req, res) => {
    const order = await Order.findById(req.params.id).populate(
        'user',
        'name email',
        //We populate from the user collection, name & email to order collection
    );
    
    if(order){
        res.status(200).json({
            order
        });
    }else{
        res.status(404);
        throw new Error('Aucune commande trouvée')
    }
});

// @desc    Update order 
// @route   PUT /api/orders/:id
// @access  Private/Admin
const updateOrder = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);

  if (!order) {
    res.status(404);
    throw new Error('Aucune commande trouvée')
  }

  if (order?.orderStatus === "Delivered") {
    res.status(400);
    throw new Error('You have already delivered this order')
    
  }

  let productNotFound = false;

  // Update products stock
  for (const item of order.orderItems) {
    const product = await Product.findById(item?.product?.toString());
    if (!product) {
      productNotFound = true;
      break;
    }
    product.stock = product.stock - item.quantity;
    await product.save({ validateBeforeSave: false });
  }

  if (productNotFound) {

    res.status(400);
    throw new Error('No Product found with one or more IDs.')
  }

  order.orderStatus = req.body.status;
  order.deliveredAt = Date.now();

  await order.save();

  res.status(200).json({
    success: true,
  });
});


// @desc    Delete order 
// @route   DELETE /api/orders/:id
// @access  Private/Admin
const deleteOrder = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);

    if (!order) {
        res.status(404);
        throw new Error('Aucune commande trouvée avec cet ID')
    }
  
    await order.deleteOne();
  
    res.status(200).json({
      success: true,
    });
});


export {
    newOrder,
    allOrders,
    myOrders,
    getOrderDetails,
    updateOrder,
    deleteOrder,
}