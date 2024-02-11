import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please enter product name"],
      maxLength: [200, "Product name cannot exceed 200 characters"],
    },
    price: {
      type: Number,
      required: [true, "Please enter product price"],
      maxLength: [5, "Product price cannot exceed 5 digits"],
    },
    description: {
      type: String,
      required: [true, "Please enter product description"],
    },
    ratings: {
      type: Number,
      default: 0,
    },
    images: [
      {
        public_id: {
          type: String,
          required: true,
        },
        url: {
          type: String,
          required: true,
        },
      },
    ],
    category: {
      type: String,
      required: [true, "Please enter product category"],
      enum: {
        values: [
          "Electronics",
          "Cameras",
          "Laptops",
          "Accessories",
          "Headphones",
          "Food",
          "Books",
          "Sports",
          "Outdoor",
          "Home",
        ],
        message: "Please select correct category",
      },
    },
    seller: {
      type: String,
      required: [true, "Please enter product seller"],
    },
    stock: {
      type: Number,
      required: [true, "Please enter product stock"],
    },
    numOfReviews: {
      type: Number,
      default: 0,
    },
    reviews: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        rating: {
          type: Number,
          required: true,
        },
        comment: {
          type: String,
          required: true,
        },
      },
    ],
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
  },
  { timestamps: true }
);


const Product = mongoose.model('Product', productSchema);
export default Product;




// {
//   "name": "SanDisk Ultra 128GB SDXC UHS-I Memory Card up to 80MB/s",
//   "price": 45.89,
//   "description": "Ultra-fast cards (2) to take better pictures and Full HD videos (1) with your compact to mid-range point-and-shoot cameras and camcorders. With SanDisk Ultra SDXC UHS-I cards you’ll benefit from faster downloads, high capacity, and better performance to capture and store 128GB (5) of high quality pictures and Full HD video (1). Take advantage of ultra-fast read speeds of up to 80MB/s (3) to save time moving photos and videos from the card to your computer. From a leader in flash memory storage, SanDisk Ultra SDXC UHS-I cards are compatible with SDHC and SDXC digital devices, and come with a 10-year limited warranty (6).",
//   "ratings": 4.5,
//   "images": [
//     {
//       "public_id": "shopit/products/demo/u0u5mx7ofp8drzi5yjjt",
//       "url": "http://res.cloudinary.com/udemy-courses/image/upload/v1689961646/shopit/products/demo/u0u5mx7ofp8drzi5yjjt.jpg"
//     },
//     {
//       "public_id": "shopit/products/demo/g3d7h76n7bdibwfgdrmf",
//       "url": "http://res.cloudinary.com/udemy-courses/image/upload/v1689961649/shopit/products/demo/g3d7h76n7bdibwfgdrmf.jpg"
//     },
//     {
//       "public_id": "shopit/products/demo/odfmkygdxwwn8i6crteq",
//       "url": "http://res.cloudinary.com/udemy-courses/image/upload/v1689961652/shopit/products/demo/odfmkygdxwwn8i6crteq.jpg"
//     }
//   ],
//   "category": "Electronics",
//   "seller": "Ebay",
//   "stock": 50,
//   "numOfReviews": 32
// }
