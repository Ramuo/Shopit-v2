import React, { useEffect, useState } from 'react';
import {useSelector} from 'react-redux';
import UserLayout from '../components/UserLayout';
import default_avatar from '../images/default_avatar.jpg';

const ProfilePage = () => {
    const {userInfo} = useSelector((state) => state.auth);
   const [avatar, setAvatar] = useState("")

   useEffect(() => {
    if(userInfo){
        setAvatar(userInfo.avatar)
    }
   }, {})
 
    return (
        <UserLayout>
            <div className="row justify-content-around mt-5 user-info">
                <div className="col-12 col-md-3">
                    <figure className="avatar avatar-profile">
                    <img
                        className="rounded-circle img-fluid"
                        // src={userInfo.avatar 
                        //     ? userInfo?.avatar?.url 
                        //     :  default_avatar
                        // }
                        src={userInfo.avatar || default_avatar }
                        alt={userInfo?.name}
                    />
                    </figure>
                </div>

                <div className="col-12 col-md-5">
                    <h4>Nom</h4>
                    <p>{userInfo?.name}</p>
                    <h4>Email</h4>
                    <p>{userInfo?.email}</p>
                    {/* <h4>Membre le</h4>
                    <p>{userInfo?.createdAt}</p> */}
                </div>
            </div>
        </UserLayout>
    )
}

export default ProfilePage;