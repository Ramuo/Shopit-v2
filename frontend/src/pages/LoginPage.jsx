import {useState, useEffect} from 'react';
import {Link, useLocation, useNavigate} from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux';
// import {Spinner} from 'flowbite-react';
// import Loader from '../components/Loader';
import {toast} from 'react-toastify';


import {setCredentials} from '../slices/authSlice';
import { useLoginMutation } from '../slices/userApiSlice';


const LoginPage = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [login, {isLoading}] = useLoginMutation();

    const {userInfo} = useSelector((state) => state.auth);

    const {search} = useLocation();
    const sp = new URLSearchParams(search);
    const redirect = sp.get('redirect') || '/';


    useEffect(() => {
        if(userInfo){
            navigate(redirect)
        }
    }, [navigate, redirect, userInfo]);

    const submitHandler = async (e) => {
        e.preventDefault();
        try {
          const res = await login({ email, password }).unwrap();
          dispatch(setCredentials({ ...res }));
          navigate(redirect);
        } catch (err) {
          toast.error(err?.data?.message || err.error);
        }
    };



    return (
        <div className="row wrapper">
            <div className="col-10 col-lg-5">
                <form
                className="shadow rounded bg-body"
                onSubmit={submitHandler}
                >
                    <h2 className="mb-4">Connexion</h2>
                    <div className="mb-3">
                        <label htmlFor="email_field" className="form-label">Email</label>
                        <input
                            type="email"
                            id="email_field"
                            className="form-control"
                            name="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
        
                    <div className="mb-3">
                        <label htmlFor="password_field" className="form-label">Password</label>
                        <input
                            type="password"
                            id="password_field"
                            className="form-control"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
        
                    <Link to="/forgotpassword" className="float-end mb-4">Mot de passe oublier?</Link>
        
                    <button 
                    id="login_button" 
                    type="submit" 
                    className="btn w-100 py-2"
                    >
                    {isLoading ? (
                        <div className="d-flex justify-content-center">
                            <div class="spinner-border spinner-border-sm text-light"  role="status" >
                                <span class="visually-hidden">Loading...</span>
                            </div>
                        </div>
                    ) : (
                      'Connexion'
                    )
                    }
                    </button>
        
                    <div className="my-3">
                        <Link to={redirect ? `/register?redirect=${redirect}` : '/register'}>
                            S'inscrire
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;