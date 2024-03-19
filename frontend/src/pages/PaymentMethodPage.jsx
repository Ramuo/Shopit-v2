import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {caluclateOrderCost} from '../components/helpers/CalculateOrderCost';
import Meta from '../components/Meta';
import CheckoutSteps from "../components/CheckoutSteps";
import {toast} from 'react-toastify'


import {
  useNewOrderMutation,
  useStripeCheckoutSessionMutation
} from '../slices/orderApiSlice';


const PaymentMethodPage = () => {
  const [method, setMethod] = useState("");

  const navigate = useNavigate();

  const { shippingInfo, cartItems } = useSelector((state) => state.cart);

  const [newOrder, {error, isSuccess }] = useNewOrderMutation();

  const [
    stripeCheckoutSession,
    { data: checkoutData, error: checkoutError, isLoading }
  ] = useStripeCheckoutSessionMutation();

  useEffect(() => {
    if (checkoutData) {
      window.location.href = checkoutData?.url;
      console.log(checkoutData)
      // navigate(checkoutData?.url)
    }

    if (checkoutError) {
      toast.error(checkoutError?.data?.message);
    }
  }, [checkoutData, checkoutError]);

  useEffect(() => {
    if (error) {
      toast.error(error?.data?.message);
    }

    if (isSuccess) {
      navigate("/orders?order_success=true");
    }
  }, [error, isSuccess, navigate]);

    const submitHandler = (e) => {
        e.preventDefault();

        const { itemsPrice, shippingPrice, taxPrice, totalPrice } =
        caluclateOrderCost(cartItems);

        if(method === 'COD'){
            const orderData = {
                shippingInfo,
                orderItems: cartItems,
                itemsPrice, 
                shippingAmount: shippingPrice, 
                taxAmount: taxPrice, 
                totalAmount: totalPrice,
                paymentInfo: {
                    status: "Not Paid"
                },
                paymentMethod: "COD",
            };
            newOrder(orderData);
        };

        if(method === 'Card'){
          const orderData = {
            shippingInfo,
            orderItems: cartItems,
            itemsPrice, 
            shippingAmount: shippingPrice, 
            taxAmount: taxPrice, 
            totalAmount: totalPrice,
          };

          stripeCheckoutSession(orderData);
        }
    }

  return (
    <>
      <Meta title={"Methode de Paiement"} />
      <CheckoutSteps shipping confirmOrder payment />

      <div className="row wrapper">
        <div className="col-10 col-lg-5">
          <form className="shadow rounded bg-body" onSubmit={submitHandler}>
            <h2 className="mb-4">Selectionner Methode de Paiement</h2>

            <div className="form-check">
              <input
                className="form-check-input"
                type="radio"
                name="payment_mode"
                id="codradio"
                value="COD"
                onChange={(e) => setMethod("COD")}
              />
              <label className="form-check-label" htmlFor="codradio">
                Paiement à la livraison
              </label>
            </div>
            <div className="form-check">
              <input
                className="form-check-input"
                type="radio"
                name="payment_mode"
                id="cardradio"
                value="Card"
                onChange={(e) => setMethod("Card")}
              />
              <label className="form-check-label" htmlFor="cardradio">
                Carte - VISA, MasterCard
              </label>
            </div>

            <button
              id="shipping_btn"
              type="submit"
              className="btn py-2 w-100"
              disabled={isLoading}
            >
              CONTINUE
            </button>
          </form>
        </div>
      </div>
    </>
  );
};


export default PaymentMethodPage