import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import {caluclateOrderCost} from '../components/helpers/CalculateOrderCost';
import CheckoutSteps from "../components/CheckoutSteps";
import Meta from "../components/Meta";

const ConfirmOrderPage = () => {
  const { cartItems, shippingInfo } = useSelector((state) => state.cart);
  const { userInfo } = useSelector((state) => state.auth);

  const navigate = useNavigate();
  

  const { itemsPrice, shippingPrice, taxPrice, totalPrice } =
    caluclateOrderCost(cartItems);

    const proceedToPaymentHandler = () => {
        navigate('/payment_method')
    };

  return (
    <>
      <Meta title={"Confirmer adresse de livraison"} />
      <CheckoutSteps shipping confirmOrder />
      <div className="row d-flex justify-content-between">
        <div className="col-12 col-lg-8 mt-5 order-confirm">
          <h4 className="mb-3">Information de Livraison</h4>
          <p>
            <b>Nom:</b> {userInfo?.name}
          </p>
          <p>
            <b>Téléphone:</b> {shippingInfo.phoneNo}
          </p>
          <p className="mb-4">
            <b>Adresse:</b> {shippingInfo?.address}, {shippingInfo?.city},{" "}
            {shippingInfo?.zipCode}, {shippingInfo?.country}
          </p>

          <hr />
          <h4 className="mt-4">Votre Panier:</h4>

          {cartItems?.map((item) => (
            <>
              <hr />
              <div className="cart-item my-1">
                <div className="row">
                  <div className="col-4 col-lg-2">
                    <img
                      src={item?.image}
                      alt="Laptop"
                      height="45"
                      width="65"
                    />
                  </div>

                  <div className="col-5 col-lg-6">
                    <Link to={`/product/${item.product}`}>{item?.name}</Link>
                  </div>

                  <div className="col-4 col-lg-4 mt-4 mt-lg-0">
                    <p>
                      {item?.quantity} x ${item?.price} ={" "}
                      <b>${(item?.quantity * item.price).toFixed(2)}</b>
                    </p>
                  </div>
                </div>
              </div>
              <hr />
            </>
          ))}
        </div>

        <div className="col-12 col-lg-3 my-4">
          <div id="order_summary">
            <h4>Commande</h4>
            <hr />
            <p>
              Total:{" "}
              <span className="order-summary-values">{itemsPrice}€</span>
            </p>
            <p>
              Livraison:{" "}
              <span className="order-summary-values">{shippingPrice}€</span>
            </p>
            <p>
              Tax: <span className="order-summary-values">{taxPrice}€</span>
            </p>

            <hr />

            <p>
              Total: <span className="order-summary-values">{totalPrice}€</span>
            </p>

            <hr />
            <Link
              to="/payment_method"
              id="checkout_btn"
              className="btn btn-primary w-100"
              onClick={proceedToPaymentHandler}
            >
              Proceder au payment
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default ConfirmOrderPage