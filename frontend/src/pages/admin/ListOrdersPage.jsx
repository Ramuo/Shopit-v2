import React, { useEffect } from "react";
import { Link} from "react-router-dom";
import { MDBDataTable } from "mdbreact";
import Loader from "../../components/Loader";
import { toast } from "react-toastify";
import Meta from "../../components/Meta";
import AdminLayout from "../../components/AdminLayout";

import {
    useGetAllOrdersQuery
} from '../../slices/orderApiSlice';

const ListOrdersPage = () => {

    const { data, isLoading, error } = useGetAllOrdersQuery();
  
    console.log(data)
  
    useEffect(() => {
      if (error) {
        toast.error(error?.data?.message);
      }
  
    //   if (deleteError) {
    //     toast.error(deleteError?.data?.message);
    //   }
  
    //   if (isSuccess) {
    //     toast.success("Product Deleted");
    //   }
    }, [error]);
  
    // const deleteProductHandler = (id) => {
    //   deleteProduct(id);
    // };
  
    const setOrders = () => {
      const orders = {
        columns: [
          {
            label: "ID",
            field: "id",
            sort: "asc",
          },
          {
            label: "Status paiement",
            field: "paymentStatus",
            sort: "asc",
          },
          {
            label: "Status de la commande",
            field: "orderStatus",
            sort: "asc",
          },
  
          {
            label: "Actions",
            field: "actions",
            sort: "asc",
          },
        ],
        rows: [],
      };
  
      data?.orders?.forEach((order) => {
        orders.rows.push({
          id: order?._id,
          paymentStatus: order?.paymentInfo?.status?.toUpperCase(),
          orderStatus: order?.orderStatus,
          actions: (
            <>
              <Link
                to={`/admin/orders/${order?._id}`}
                className="btn btn-outline-primary"
              >
                <i className="fa fa-pencil"></i>
              </Link>

              <button
                className="btn btn-outline-danger ms-2"
                // onClick={() => deleteProductHandler(product?._id)}
                // disabled={isDeleteLoading}
              >
                <i className="fa fa-trash"></i>
              </button>
            </>
          ),
        });
      });
  
      return orders;
    };
  
    if (isLoading) return <Loader />;
  
    return (
      <AdminLayout>
        <Meta title={"Liste des Produits"} />
  
        <h1 className="my-5">{data?.orders?.length} Commandes</h1>
  
        <MDBDataTable
          data={setOrders()}
          className="px-3"
          bordered
          striped
          hover
        />
      </AdminLayout>
    );
  };

export default ListOrdersPage;