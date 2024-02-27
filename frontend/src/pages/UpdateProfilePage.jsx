import {useState, useEffect} from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {toast} from 'react-toastify';

import { useUpdateProfileMutation } from '../slices/userApiSlice';

const UpdateProfilePage = () => {
    const navigate = useNavigate();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');

    const {userInfo} = useSelector((state) => state.auth);

    const [updateProfile, {isLoading}] = useUpdateProfileMutation();

    useEffect(() => {
        if(userInfo){
            setName(userInfo?.name);
            setEmail(userInfo?.email);
        }

    }, [userInfo]);

    const submitHandler = async (e) => {
        e.preventDefault();

        try {
            await updateProfile({name, email})
            toast.success('Profil modifié avec succès');
            navigate('/me/profile');
        } catch (err) {
            toast.error(err?.data?.message || err.error);
            
        }
        
    };

    return (
        <div class="row wrapper">
            <div class="col-10 col-lg-8">
            <form
            class="shadow rounded bg-body"
            onSubmit={submitHandler}
            >
                <h2 class="mb-4">Profile</h2>
    
                <div class="mb-3">
                    <label htmlFor="name_field" class="form-label"> Nom </label>
                    <input
                        type="text"
                        id="name_field"
                        class="form-control"
                        name={name}
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>
    
                <div class="mb-3">
                <label htmlFor="email_field" class="form-label"> Email </label>
                <input
                    type="email"
                    id="email_field"
                    class="form-control"
                    name={email}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                </div>
    
                <button type="submit" class="btn update-btn w-100">Mettre à jour</button>
            </form>
            </div>
        </div>
    )
}

export default UpdateProfilePage;