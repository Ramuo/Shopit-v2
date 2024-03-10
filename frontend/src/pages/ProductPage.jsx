import { useState, useEffect } from 'react';
import { useParams, Link,} from 'react-router-dom';
import { useDispatch, useSelector} from 'react-redux';
import Loader from '../components/Loader';
import {Alert} from 'flowbite-react';
import StarRatings from 'react-star-ratings';
import NewReview from '../components/NewReview';
import ListReviews from '../components/ListReviews';



import {useGetProductDetailsQuery} from '../slices/prductApiSlice';
import { setCartItem } from '../slices/cartSlice';


const ProductPage = () => {
    const {id: productId} = useParams();
    const dispatch = useDispatch();

    const [quantity, setQuantity] = useState(1);
    const [activeImg, setActiveImg] = useState('');

    const {
        data, 
        isLoading, 
        error
    } = useGetProductDetailsQuery(productId);
    const product = data?.product;

    const {userInfo} = useSelector((state) => state.auth);


    useEffect(() => {
        setActiveImg(
            product?.images[0] 
            ? product?.images[0]?.url 
            : product?.name 
        )
    }, [product]);


    const increseQty = () => {
        const count = document.querySelector(".count");
    
        if (count.valueAsNumber >= product?.stock) return;
    
        const qty = count.valueAsNumber + 1;
        setQuantity(qty);
    };
    
    const decreseQty = () => {
        const count = document.querySelector(".count");
    
        if (count.valueAsNumber <= 1) return;
    
        const qty = count.valueAsNumber - 1;
        setQuantity(qty);
    };


    const setItemToCart = () => {
        const cartItem = {
          product: product?._id,
          name: product?.name,
          price: product?.price,
          image: product?.images[0]?.url,
          stock: product?.stock,
          quantity,
        };
    
        dispatch(setCartItem(cartItem));
        // toast.success("Item added to Cart");
    };

    return (
        <>
            {isLoading ? (
                    <Loader/>
                ) : error ? (
                    <Alert color='failure' className='mt-5'>
                        {error?.message}
                    </Alert>
                ) : (
                    <div className="row d-flex justify-content-around">
                        <div className="col-12 col-lg-5 img-fluid" id="product_image">
                            <div className="p-3">
                                <img
                                    className="d-block w-100"
                                    src={activeImg}
                                    alt={product?.name}
                                    width="340"
                                    height="390"
                                />
                            </div>
                            <div className="row justify-content-start mt-5">
                                {product?.images?.map((img) => (
                                    <div className="col-2 ms-4 mt-2">
                                        <Link role="button">
                                            <img
                                                className={`d-block border rounded p-3 cursor-pointer ${
                                                    img?.url === activeImg ? "border-warning" : ""
                                                } `}
                                                height="100"
                                                width="100"
                                                src={img?.url}
                                                alt={img?.url}
                                                onClick={(e) => setActiveImg(img?.url)}
                                            />
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        </div>
        
                        <div className="col-12 col-lg-5 mt-5">
                            <h3>{product?.name}</h3>
                            <p id="product_id">{product?._id}</p>
        
                            <hr />
        
                            <div className=" ratings mt-auto d-flex"> 
                                <StarRatings
                                rating={product?.ratings}
                                starRatedColor='#ffb829'
                                numberOfStars={5}
                                name='rating'
                                starDimension='24px'
                                starSpacing='1px'
                                />
                                <span id="no-of-reviews" className="pt-1 ps-2">
                                    ({product?.numOfReviews})
                                </span>
                            </div>
                            <hr />
        
                            <p id="product_price">{product?.price}</p>
                            <div className="stockCounter d-inline">
                                <span className="btn btn-danger minus" onClick={decreseQty}>
                                -
                                </span>
                                <input
                                type="number"
                                className="form-control count d-inline"
                                value={quantity}
                                readonly
                                />
                                <span className="btn btn-primary plus" onClick={increseQty}>
                                +
                                </span>
                            </div>
                            <button
                            type="button"
                            id="cart_btn"
                            className="btn btn-primary d-inline ms-4"
                            disabled={product.stock <= 0}
                            onClick={setItemToCart}
                            >
                                + Panier
                            </button>
        
                            <hr />
        
                            <p>
                                Statut: {" "}
                                <span id="stock_status" className={product.stock > 0 ? 'greenColor' : 'redColor'}>
                                    {product.stock > 0 ? 'En Stock' : 'Epuisé' }
                                </span>
                            </p>
        
                            <hr />
        
                            <h4 className="mt-2">Description:</h4>
                            <p>
                                {product?.description}
                            </p>
                            <hr />
                            <p id="product_seller mb-3">Vendu par: <strong>{product?.seller}</strong></p>
                            {userInfo ? (
                                <NewReview productId={product?._id}/>
                            ) : (
                                <div className="alert alert-danger my-5" type="alert">
                                    Connecter vous pour nous laiser un avis
                                </div>
                            )
                            }
                        </div>
                        
                    </div>
            )}
            {product?.reviews?.length > 0 && (
                <ListReviews reviews={product?.reviews} />
            )}
        </>
    );
};

export default ProductPage;