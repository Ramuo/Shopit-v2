import React from 'react';
import SidebarManu from './SidebarManu';

const AdminLayout = ({children}) => {

    const menuItems = [
        {
          name: "Dashboard",
          url: "/admin/dashboard",
          icon: "fas fa-tachometer-alt",
        },
        {
          name: "Nouveau Produit",
          url: "/admin/product/new",
          icon: "fas fa-plus",
        },
        {
          name: "Produits",
          url: "/admin/products",
          icon: "fab fa-product-hunt",
        },
        {
          name: "Commandes",
          url: "/admin/orders",
          icon: "fas fa-receipt",
        },
        {
          name: "Utilisateurs",
          url: "/admin/users",
          icon: "fas fa-users",
        },
        {
          name: "Avis",
          url: "/admin/reviews",
          icon: "fas fa-star",
        },
    ];

    return (
        <div>
            <div className="mt-2 mb-4 py-4">
                <h2 className="text-center fw-bolder">Admin Dashboard</h2>
            </div>

           
            <div className="row justify-content-around">
                <div className="col-12 col-lg-3">
                    <SidebarManu menuItems={menuItems}/>
                </div>
                <div className="col-12 col-lg-8 user-dashboard">{children}</div>
            </div>
        </div>
    );
};

export default AdminLayout