import { useState, useEffect } from 'react';
import { useParams, Link} from 'react-router-dom';
import Loader from '../components/Loader';
import {Alert} from 'flowbite-react';
import StarRatings from 'react-star-ratings';


import {useGetProductDetailsQuery} from '../slices/prductApiSlice';


const ProductPage = () => {
    const {id: productId} = useParams();

    const [activeImg, setActiveImg] = useState('');

    const {
        data, 
        isLoading, 
        error
    } = useGetProductDetailsQuery(productId);
    console.log(data)
    // OPTIONAL
    // const product = data?.product

    useEffect(() => {
        setActiveImg(
            data?.product?.images[0] 
            ? data?.product?.images[0]?.url 
            : data?.product?.name 
        )
    }, [data?.product])

    return (
        <>
            {isLoading ? (
                    <Loader/>
                ) : error ? (
                    <Alert color='failure' className='mt-5'>
                        {error?.data?.message}
                    </Alert>
                ) : (
                    <div className="row d-flex justify-content-around">
                        <div className="col-12 col-lg-5 img-fluid" id="product_image">
                            <div className="p-3">
                                <img
                                    className="d-block w-100"
                                    src={activeImg}
                                    alt={data?.product?.name}
                                    width="340"
                                    height="390"
                                />
                            </div>
                            <div className="row justify-content-start mt-5">
                                {data?.product?.images?.map((img) => (
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
                            <h3>{data?.product?.name}</h3>
                            <p id="product_id">{data?.product?._id}</p>
        
                            <hr />
        
                            <div className=" ratings mt-auto d-flex"> 
                                <StarRatings
                                rating={data?.product?.ratings}
                                starRatedColor='#ffb829'
                                numberOfStars={5}
                                name='rating'
                                starDimension='24px'
                                starSpacing='1px'
                                />
                                <span id="no-of-reviews" className="pt-1 ps-2">
                                    ({data?.product?.numOfReviews})
                                </span>
                            </div>
                            <hr />
        
                            <p id="product_price">{data?.product?.price}</p>
                            <div className="stockCounter d-inline">
                                <span className="btn btn-danger minus">-</span>
                                <input
                                    type="number"
                                    className="form-control count d-inline"
                                    value="1"
                                    readonly
                                />
                                <span className="btn btn-primary plus">+</span>
                            </div>
                            <button
                            type="button"
                            id="cart_btn"
                            className="btn btn-primary d-inline ms-4"
                            disabled=""
                            >
                                Add to Cart
                            </button>
        
                            <hr />
        
                            <p>
                                Statut: {" "}
                                <span id="stock_status" className={data?.product.stock > 0 ? 'greenColor' : 'redColor'}>
                                    {data?.product.stock > 0 ? 'En Stock' : 'Epuisé' }
                                </span>
                            </p>
        
                            <hr />
        
                            <h4 className="mt-2">Description:</h4>
                            <p>
                                {data?.product?.description}
                            </p>
                            <hr />
                            <p id="product_seller mb-3">Sold by: <strong>{data?.product?.seller}</strong></p>
        
                            <div className="alert alert-danger my-5" type="alert">
                                Login to post your review.
                            </div>
                        </div>
                    </div>
            )}

        </>
    );
};

export default ProductPage;