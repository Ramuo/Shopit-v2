import React, { useEffect, useState } from "react";
import Loader from "../../components/Loader";
import { toast } from "react-toastify";
import { Link, useParams } from "react-router-dom";
import Meta from "../../components/Meta";
import AdminLayout from "../../components/AdminLayout";

import {
  useGetOrderDetailsQuery,
  useUpdateOrderMutation
} from "../../slices/orderApiSlice";

const EditOrderPage = () => {
  
    const [status, setStatus] = useState("");

  const params = useParams();
  const { data } = useGetOrderDetailsQuery(params?.id);
  const order = data?.order || {};

  const [updateOrder, { error, isSuccess }] = useUpdateOrderMutation();

  const {
    shippingInfo,
    orderItems,
    paymentInfo,
    user,
    totalAmount,
    orderStatus,
  } = order;

  const isPaid = paymentInfo?.status === "paid" ? true : false;

  useEffect(() => {
    if (orderStatus) {
      setStatus(orderStatus);
    }
  }, [orderStatus]);

  useEffect(() => {
    if (error) {
      toast.error(error?.data?.message);
    }

    if (isSuccess) {
      toast.success("Order updated");
    }
  }, [error, isSuccess]);

  const updateOrderHandler = (id) => {
    const data = { status };
    updateOrder({ id, body: data });
  };

  return (
    <AdminLayout>
      <Meta title={"Commande"} />
      <div className="row d-flex justify-content-around">
        <div className="col-12 col-lg-8 order-details">
          <h3 className="mt-5 mb-4"> Détail Commande</h3>

          <table className="table table-striped table-bordered">
            <tbody>
              <tr>
                <th scope="row">ID</th>
                <td>{order?._id}</td>
              </tr>
              <tr>
                <th scope="row">Statut Commande</th>
                <td
                  className={
                    String(orderStatus).includes("Delivered")
                      ? "greenColor"
                      : "redColor"
                  }
                >
                  <b>{orderStatus}</b>
                </td>
              </tr>
            </tbody>
          </table>

          <h3 className="mt-5 mb-4">Livraison</h3>
          <table className="table table-striped table-bordered">
            <tbody>
              <tr>
                <th scope="row">Nom</th>
                <td>{user?.name}</td>
              </tr>
              <tr>
                <th scope="row">Téléphone</th>
                <td>{shippingInfo?.phoneNo}</td>
              </tr>
              <tr>
                <th scope="row">Adresse</th>
                <td>
                  {shippingInfo?.address}, {shippingInfo?.city},{" "}
                  {shippingInfo?.zipCode}, {shippingInfo?.country}
                </td>
              </tr>
            </tbody>
          </table>

          <h3 className="mt-5 mb-4">Détail Paiement</h3>
          <table className="table table-striped table-bordered">
            <tbody>
              <tr>
                <th scope="row">Statut</th>
                <td className={isPaid ? "greenColor" : "redColor"}>
                  <b>{paymentInfo?.status}</b>
                </td>
              </tr>
              <tr>
                <th scope="row">Methode</th>
                <td>{order?.paymentMethod}</td>
              </tr>
              <tr>
                <th scope="row">Type</th>
                <td>{paymentInfo?._id || "Nill"}</td>
              </tr>
              <tr>
                <th scope="row">Montant Payé</th>
                <td>{totalAmount}€</td>
              </tr>
            </tbody>
          </table>

          <h3 className="mt-5 my-4">Article:</h3>

          <hr />
          <div className="cart-item my-1">
            {orderItems?.map((item) => (
              <div className="row my-5">
                <div className="col-4 col-lg-2">
                  <img
                    src={item?.image}
                    alt={item?.name}
                    height="45"
                    width="65"
                  />
                </div>

                <div className="col-5 col-lg-5">
                  <Link to={`/products/${item?.product}`}>{item?.name}</Link>
                </div>

                <div className="col-4 col-lg-2 mt-4 mt-lg-0">
                  <p>{item?.price}€</p>
                </div>

                <div className="col-4 col-lg-3 mt-4 mt-lg-0">
                  <p>{item?.quantity}</p>
                </div>
              </div>
            ))}
          </div>
          <hr />
        </div>

        <div className="col-12 col-lg-3 mt-5">
          <h4 className="my-4">Statut</h4>

          <div className="mb-3">
            <select
              className="form-select"
              name="status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="Processing">En cours</option>
              <option value="Shipped">Expédié</option>
              <option value="Delivered">Livré</option>
            </select>
          </div>

          <button
            className="btn btn-primary w-100"
            onClick={() => updateOrderHandler(order?._id)}
          >
            Mise à jour
          </button>

          <h4 className="mt-5 mb-3">Reçu</h4>
          <Link
            to={`/invoice/order/${order?._id}`}
            className="btn btn-success w-100"
          >
            <i className="fa fa-print"></i> Generer un reçu
          </Link>
        </div>
      </div>
    </AdminLayout>
  );
};

export default EditOrderPage