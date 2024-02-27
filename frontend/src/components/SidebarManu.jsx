import {useState} from 'react';
import { Link, useLocation } from 'react-router-dom';

const SidebarManu = () => {
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

    const location = useLocation();
    const [activeMenuItem, setActiveMenuItem] = useState(location.pathname);

    const handleMenuItemClick = (menuItemUrl) => {
        setActiveMenuItem(menuItemUrl);
    };

    return (
        <div className="list-group mt-5 pl-4">
            {menuItems?.map((menuItem, index) => (
                <Link
                key={index}
                to={menuItem?.url}
                onClick={() => handleMenuItemClick(menuItem.url)}
                className={`fw-bold list-group-item list-group-item-action ${
                    activeMenuItem.includes(menuItem?.url) 
                    ? "active" 
                    : ""
                }`}
                aria-current={
                    activeMenuItem.includes(menuItem?.url) 
                    ? "true" 
                    : "false"
                }
                >
                    <i className={`${menuItem?.icon} fa-fw pe-2`}></i> {menuItem?.name}
                </Link>
            ))}
        </div>
    );
};

export default SidebarManu