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

//@desc     Get All orders
//@route    GET /api/orders
//@access   Private/Admin
const getAllOrders = asyncHandler(async(req, res) => {
    const orders = await Order.find({});

    res.status(200).json({orders});
});

////TO GET SALES DATA

async function getSalesData(startDate, endDate) {
    const salesData = await Order.aggregate([
      {
        // Stage 1 - Filter results
        $match: {
          createdAt: {
            $gte: new Date(startDate),
            $lte: new Date(endDate),
          },
        },
      },
      {
        // Stage 2 - Group Data
        $group: {
          _id: {
            date: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          },
          totalSales: { $sum: "$totalAmount" },
          numOrders: { $sum: 1 }, // count the number of orders
        },
      },
    ]);
  
    // Create a Map to store sales data and num of order by data
    const salesMap = new Map();
    let totalSales = 0;
    let totalNumOrders = 0;
  
    salesData.forEach((entry) => {
      const date = entry?._id.date;
      const sales = entry?.totalSales;
      const numOrders = entry?.numOrders;
  
      salesMap.set(date, { sales, numOrders });
      totalSales += sales;
      totalNumOrders += numOrders;
    });
  
    // Generate an array of dates between start & end Date
    const datesBetween = getDatesBetween(startDate, endDate);
  
    // Create final sales data array with 0 for dates without sales
    const finalSalesData = datesBetween.map((date) => ({
      date,
      sales: (salesMap.get(date) || { sales: 0 }).sales,
      numOrders: (salesMap.get(date) || { numOrders: 0 }).numOrders,
    }));
  
    return { salesData: finalSalesData, totalSales, totalNumOrders };
  }
  
  function getDatesBetween(startDate, endDate) {
    const dates = [];
    let currentDate = new Date(startDate);
  
    while (currentDate <= new Date(endDate)) {
      const formattedDate = currentDate.toISOString().split("T")[0];
      dates.push(formattedDate);
      currentDate.setDate(currentDate.getDate() + 1);
    }
  
    return dates;
  }

//@desc     Get Sales
//@route    GET /api/orders/get_sales
//access    Private/admin
const getSales = asyncHandler (async (req, res) => {
    const startDate = new Date(req.query.startDate);
    const endDate = new Date(req.query.endDate);
  
    startDate.setUTCHours(0, 0, 0, 0);
    endDate.setUTCHours(23, 59, 59, 999);
  
    const { salesData, totalSales, totalNumOrders } = await getSalesData(
      startDate,
      endDate
    );
  
    res.status(200).json({
      totalSales,
      totalNumOrders,
      sales: salesData,
    });
});


export {
    newOrder,
    allOrders,
    myOrders,
    getOrderDetails,
    updateOrder,
    deleteOrder,
    getAllOrders,
    getSales
}