import {useState, useEffect}from 'react';
import {useSelector} from 'react-redux';
import {toast} from 'react-toastify';
import {useNavigate, useParams} from 'react-router-dom';


import {
  useResetpasswordMutation
} from '../slices/userApiSlice';

const ResetPasswordPage = () => {
    const navigate = useNavigate();
    const params = useParams();


    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const {userInfo} = useSelector((state) => state.auth);


  console.log(userInfo)

  const [resetPassword, { isLoading, error, isSuccess }] =
  useResetpasswordMutation();

    useEffect(() => {
        if(userInfo){
            navigate('/')
        };

        if (error) {
          toast.error(error?.data?.message);
        }
    
        if (isSuccess) {
          toast.success("Password reset successfully");
          navigate("/login");
        }
    }, [navigate,  userInfo, error, isSuccess]);


    const submitHandler = (e) => {
      e.preventDefault();
  
      if (password !== confirmPassword) {
        return toast.error("Password does not match. Try again!");
      }
  
      const data = { password, confirmPassword };
  
      resetPassword({ token: params?.token, body: data });
    };

    return (
        <>
          <div className="row wrapper">
            <div className="col-10 col-lg-5">
              <form 
              className="shadow rounded bg-body" 
              onSubmit={submitHandler}
              >
                <h2 className="mb-4">Nouveau mot de passe</h2>
    
                <div className="mb-3">
                  <label htmlFor="password_field" className="form-label">
                    Mot de passe
                  </label>
                  <input
                    type="password"
                    id="password_field"
                    className="form-control"
                    name="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
    
                <div className="mb-3">
                  <label htmlFor="confirm_password_field" className="form-label">
                    Confirmer mot de passe
                  </label>
                  <input
                    type="password"
                    id="confirm_password_field"
                    className="form-control"
                    name={confirmPassword}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
    
                <button
                  id="new_password_button"
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
                      'Réinitialiser'
                    )
                    }
                </button>
              </form>
            </div>
          </div>
        </>
      );
};

export default ResetPasswordPage;