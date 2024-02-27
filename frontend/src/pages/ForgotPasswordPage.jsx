import {useState, useEffect}from 'react';
import {useSelector} from 'react-redux';
import {toast} from 'react-toastify';
import {useNavigate} from 'react-router-dom';


import {useForgotpasswordMutation} from '../slices/userApiSlice';

const ForgotPasswordPage = () => {
    const navigate = useNavigate();
    // const dispatch = useDispatch();

    const [email, setEmail ] = useState("");

    const {userInfo} = useSelector((state) => state.auth);

    const [forgotpassword, {isLoading}] = useForgotpasswordMutation(); 

    useEffect(() => {
        if(userInfo){
            navigate('/')
        }
    }, [navigate,  userInfo]);

    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            await forgotpassword({ email}).unwrap();
        //   dispatch(setCredentials({ ...res }));
        //   navigate(redirect);
          toast.success("Verifier votre boite email")
          navigate('/');
        } catch (err) {
          toast.error(err?.data?.message || err.error);
        }
    };


    return (
        <div className="row wrapper">
            <div className="col-10 col-lg-5">
                <form
                className="shadow rounded bg-body"
                onSubmit={ submitHandler}
                >
                <h2 className="mb-4">Mot de passe oublier</h2>
                <div className="mt-3">
                    <label ht="email_field" className="form-label">Votre Email</label>
                    <input
                    type="email"
                    id="email_field"
                    className="form-control"
                    name={email}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    />
                </div>

                <button
                    id="forgot_password_button"
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
                </form>
            </div>
        </div>
    );
}

export default ForgotPasswordPage;