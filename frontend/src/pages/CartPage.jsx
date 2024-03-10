import React from 'react';
import {useSelector, useDispatch} from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import Meta from '../components/Meta';



import { 
    setCartItem,
    removeFromCart 
} from '../slices/cartSlice';

const CartPage = () => {
    const {cartItems} = useSelector((state) => state.cart);
    const dispatch = useDispatch();
    const navigate = useNavigate();


    
    const increseQty = (item, quantity) => {
        const newQty = quantity + 1;
    
        if (newQty > item?.stock) return;
    
        setItemToCart(item, newQty);
      };
    
      const decreseQty = (item, quantity) => {
        const newQty = quantity - 1;
    
        if (newQty <= 0) return;
    
        setItemToCart(item, newQty);
      };
    
      const setItemToCart = (item, newQty) => {
        const cartItem = {
          product: item?.product,
          name: item?.name,
          price: item?.price,
          image: item?.image,
          stock: item?.stock,
          quantity: newQty,
        }; 

        dispatch(setCartItem(cartItem));
    };

    const removeFromCartHandler = async (id) => {
        dispatch(removeFromCart(id));
    };

    const checkoutHandler = () => {
        navigate('/shipping')
    }

    return (
    <>
        <Meta title={'Votre Panier'}/>
        {cartItems?.length === 0 ? (
            <h2 className="mt-5">
                Votre Panier: <b>est vide</b>
            </h2>
        ) : (
            <>
                <h2 className="mt-5">
                    Votre Panier: <b>{cartItems?.length}</b> Articles
                </h2>
                <div className="row d-flex justify-content-between">
                    <div className="col-12 col-lg-8">
                        {cartItems?.map((item) => (
                            <>
                                <hr />
                                <div className="cart-item" data-key="product1">
                                <div className="row">
                                    <div className="col-4 col-lg-3">
                                    <img
                                        src={item?.image}
                                        alt="Laptop"
                                        height="90"
                                        width="115"
                                    />
                                    </div>
                                    <div className="col-5 col-lg-3">
                                    <Link to={`/products/${item?.product}`}> {item?.name} </Link>
                                    </div>
                                    <div className="col-4 col-lg-2 mt-4 mt-lg-0">
                                    <p id="card_item_price">{item?.price}€</p>
                                    </div>
                                    <div className="col-4 col-lg-3 mt-4 mt-lg-0">
                                    <div className="stockCounter d-inline">
                                        <span className="btn btn-danger minus" onClick={() => decreseQty(item, item?.quantity)}> - </span>
                                        <input
                                        type="number"
                                        className="form-control count d-inline"
                                        value={item?.quantity}
                                        readonly
                                        />
                                        <span className="btn btn-primary plus" onClick={() => increseQty(item, item?.quantity)}> + </span>
                                    </div>
                                    </div>
                                    <div className="col-4 col-lg-1 mt-4 mt-lg-0">
                                    <i id="delete_cart_item" className="fa fa-trash btn btn-danger"
                                    onClick={() => removeFromCartHandler(item?.product)}
                                    >
                                    </i>
                                    </div>
                                </div>
                                </div>
                                <hr />
                            </>
                        ))}
                        {/* <!-- Add more cart items here as needed --> */}
                    </div>

                    <div className="col-12 col-lg-3 my-4">
                        <div id="order_summary">
                        <h4>Récapitulati</h4>
                        <hr />
                        <p> Articles: 
                            <span className="order-summary-values">
                                {cartItems?.reduce((acc, item) => acc + item?.quantity, 0)}
                            </span>
                        </p>
                        <p> Total: 
                            <span className="order-summary-values">
                            {cartItems?.reduce((acc, item) => acc + item?.quantity * item?.price, 0).toFixed(2)}€
                            </span>
                        </p>
                        <hr />
                        <button id="checkout_btn" className="btn btn-primary w-100"
                        onClick={checkoutHandler}
                        >
                            CONTINUER
                        </button>
                        </div>
                    </div>
                </div>
            </>
        )
        }
        
    </>
    )
}

export default CartPage;