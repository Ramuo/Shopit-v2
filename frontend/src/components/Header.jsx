import {useSelector, useDispatch} from 'react-redux';
import {Link, useNavigate} from 'react-router-dom';
import shopit_logo from '../images/shopit_logo.png';
import default_avatar from '../images/default_avatar.jpg';
import SearchBox from './SearchBox';


import {
    useLogoutMutation,
    // useGetUserProfileQuery
} from '../slices/userApiSlice'
import {logout} from '../slices/authSlice'


const Header = () => {
    const {cartItems} = useSelector((state) => state.cart);
    const {userInfo} = useSelector((state) => state.auth);

    
    
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [logoutApiCall] = useLogoutMutation();


    // const {data, isLoading, isError} = useGetUserProfileQuery();
    // console.log(data)

    const logoutHandler = async () => {
        try {
            await logoutApiCall().unwrap();
            dispatch(logout());
            navigate('/');
        } catch (err) {
            console.log(err);
        }
    }
    

    return (
        <nav className="navbar row">
            <div className="col-12 col-md-3 ps-5">
                <div className="navbar-brand">
                    <Link to="/">
                        <img src={shopit_logo} alt="ShopIT Logo" />
                    </Link>
                </div>
            </div>
            <div className="col-12 col-md-4 mt-2 mt-md-0">
                <SearchBox/>
            </div>
            <div className="col-12 col-md-5 mt-4 mt-md-0 text-center">
                <Link to="/cart" style={{textDecoration: "none"}}>
                    <span id="cart" className="ms-3"> Panier </span>
                    <span className="ms-1" id="cart_count">
                        {cartItems?.length}
                    </span>
                </Link>

                {userInfo ? (
                    <>
                        <div className="ms-4 dropdown">
                            <button
                            className="btn dropdown-toggle text-white"
                            type="button"
                            id="dropDownMenuButton"
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                            >
                                <figure className="avatar avatar-nav">
                                    <img
                                        src={userInfo?.avatar 
                                            ? userInfo?.avatar?.url 
                                            :  default_avatar
                                        }
                                        alt="User Avatar"
                                        className="rounded-circle"
                                    />
                                </figure>
                                <span>{userInfo?.name}</span>
                            </button>
                            <div className="dropdown-menu w-100" aria-labelledby="dropDownMenuButton">
                                <Link className="dropdown-item" to="/admin/dashboard"> Dashboard </Link>

                                <Link className="dropdown-item" to="/orders"> Commandes </Link>

                                <Link className="dropdown-item" to="/me/profile"> Profil </Link>

                                <Link 
                                className="dropdown-item text-danger" 
                                to="/"
                                onClick={logoutHandler}
                                >
                                    Deconnexion 
                                </Link>
                            </div>
                        </div>
                    </>
                ) : (
                    <Link to="/login" 
                    className="btn ms-4" 
                    id="login_btn"
                    > 
                        Connexion 
                    </Link>

                )}


            </div>
        </nav>
    );
};

export default Header;







