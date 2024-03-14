import React, { useEffect } from "react";
import { Link} from "react-router-dom";
import { MDBDataTable } from "mdbreact";
import Loader from "../../components/Loader";
import { toast } from "react-toastify";
import Meta from "../../components/Meta";
import AdminLayout from "../../components/AdminLayout";

import {useGetAllProductQuery} from '../../slices/prductApiSlice';

const ListProductPage = () => {
    const { data, isLoading, error } = useGetAllProductQuery();
  
    // const [
    //   deleteProduct,
    //   { isLoading: isDeleteLoading, error: deleteError, isSuccess },
    // ] = useDeleteProductMutation();
  
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
  
    const setProducts = () => {
      const products = {
        columns: [
          {
            label: "ID",
            field: "id",
            sort: "asc",
          },
          {
            label: "Nom",
            field: "name",
            sort: "asc",
          },
          {
            label: "Stock",
            field: "stock",
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
  
      data?.products?.forEach((product) => {
        products.rows.push({
          id: product?._id,
          name: `${product?.name?.substring(0, 20)}...`,
          stock: product?.stock,
          actions: (
            <>
              <Link
                to={`/admin/products/${product?._id}`}
                className="btn btn-outline-primary"
              >
                <i className="fa fa-pencil"></i>
              </Link>
              <Link
                to={`/products/${product?._id}/upload_images`}
                className="btn btn-outline-success ms-2"
              >
                <i className="fa fa-image"></i>
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
  
      return products;
    };
  
    if (isLoading) return <Loader />;
  
    return (
      <AdminLayout>
        <Meta title={"Liste Produit"} />
  
        <h1 className="my-5">{data?.products?.length} Liste Produit</h1>
  
        <MDBDataTable
          data={setProducts()}
          className="px-3"
          bordered
          striped
          hover
        />
      </AdminLayout>
    );
  };

export default ListProductPage;