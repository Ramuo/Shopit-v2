import React from 'react';
import SidebarManu from './SidebarManu';

const UserLayout = ({children}) => {

    const menuItems = [
        {
          name: "Profile",
          url: "/me/profile",
          icon: "fas fa-user",
        },
        {
          name: "Update Profile",
          url: "/me/updateprofile",
          icon: "fas fa-user",
        },
        // {
        //   name: "Upload Avatar",
        //   url: "/me/uploadavatar",
        //   icon: "fas fa-user-circle",
        // },
        {
          name: "Update Password",
        //   url: "/me/updatepassword",
          url: "/",
          icon: "fas fa-lock",
        },
    ];

    return (
        <div>
            <div className="mt-2 mb-4 py-4">
                <h2 className="text-center fw-bolder">Profil Settings</h2>
            </div>

            <div className="container">
                <div className="row justify-content-around">
                    <div className="col-12 col-lg-3">
                        <SidebarManu menuItems={menuItems}/>
                    </div>
                    <div className="col-12 col-lg-8 user-dashboard">{children}</div>
                </div>
            </div>
        </div>
    );
};

export default UserLayout;