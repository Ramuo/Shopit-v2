import {useState, useEffect} from 'react';
import {Link, useLocation, useNavigate} from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux';
// import Loader from '../components/Loader';
import {toast} from 'react-toastify';


import { useRegisterMutation } from '../slices/userApiSlice';
import {setCredentials} from '../slices/authSlice';



const RegisterPage = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    

    const [register, {isLoading}] = useRegisterMutation();

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
          const res = await register({ name, email, password }).unwrap();
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
                    <h2 className="mb-4">S'inscrire</h2>
                    <div className="mb-3">
                        <label htmlFor="name_field" className="form-label">Nom</label>
                        <input
                        type="text"
                        id="name_field"
                        class="form-control"
                        name="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        />
                    </div>

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
                      'Envoyer'
                    )
                    }
                    </button>
        
                    <div className="my-3">
                        Vous avez déjà un compte?
                        {" "}
                        <Link to={redirect ? `/login?redirect=${redirect}` : '/login'}>
                            Se connecter
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default RegisterPage;