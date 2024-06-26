// import {useState, useEffect} from 'react';
// import { useSelector } from 'react-redux';
// import { useNavigate } from 'react-router-dom';
// import UserLayout from '../components/UserLayout';
// import default_avatar from '../images/default_avatar.jpg';
// import {toast} from 'react-toastify';


// import {useUploadavatarMutation} from '../slices/userApiSlice';

// const UploadavatarPage = () => {
//     const { userInfo } = useSelector((state) => state.auth);

//     const navigate = useNavigate();

//     const [avatar, setAvatar] = useState("");
//     const [avatarPreview, setAvatarPreview] = useState(
//       userInfo?.avatar ? userInfo?.avatar?.url : default_avatar
//     );
    

//     const [uploadavatar, {isLoading, error, isSuccess}] = useUploadavatarMutation();
    
//     useEffect(() => {
//         if(error){
//             toast.error(error?.data.message)
//         };
//         if(isSuccess){
//             toast.success("Image téléchargé");
//             navigate("/me/profile");
//         };

//     }, [error, isSuccess]);



//     const submitHandler = async (e) => {
//         e.preventDefault();

//         try {
//             await uploadavatar({avatar})
//             toast.success('Image modifiée avec succès');
//             // navigate('/me/profile');
//         } catch (err) {
//             toast.error(err?.data?.message || err.error);
            
//         }
        
//     };


//     const onChange = (e) => {
//         const reader = new FileReader();

//         reader.onload = () => {
//             if(reader.readyState === 2){
//                 setAvatarPreview(reader.result)
//                 setAvatar(reader.result)
//             }
//         }

//         reader.readAsDataURL(e.target.files[0]);
//     }

//     return (
//         <UserLayout>
//             <div className="row wrapper">
//                 <div className="col-10 col-lg-8">
//                 <form
//                 onSubmit={submitHandler}
//                 className="shadow rounded bg-body"
//                 >
//                     <h2 className="mb-4">Télécharger une Image</h2>
        
//                     <div className="mb-3">
//                         <div className="d-flex align-items-center">
//                             <div className="me-3">
//                             <figure className="avatar item-rtl">
//                                 <img src={avatarPreview}
//                                 className="rounded-circle" 
//                                 alt="imageAvatar" 
//                                 />
//                             </figure>
//                             </div>
//                             <div className="input-foam">
//                             <label className="form-label" htmlFor="customFile">
//                                 Choisir une image
//                             </label>
//                             <input
//                             type="file"
//                             name="avatar"
//                             className="form-control"
//                             id="customFile"
//                             accept="images/*"
//                             value={avatar}
//                             onChange={onChange}
//                             />
//                             </div>
//                         </div>
//                     </div>
        
//                     <button
//                     id="register_button"
//                     type="submit"
//                     class="btn w-100 py-2"
//                     disabled={isLoading}
//                     >
//                         {
//                         isLoading ? (
//                             <div className="d-flex justify-content-center">
//                                 <div class="spinner-border spinner-border-sm text-light"  role="status" >
//                                     <span class="visually-hidden">Loading...</span>
//                                 </div>
//                             </div>
//                         ) : (
//                             "Télécharger"
//                         )
//                         }
//                     </button>
//                 </form>
//                 </div>
//             </div>
//         </UserLayout>
//     );
// };

// export default UploadavatarPage;


import React, { useEffect, useState } from "react";
import UserLayout from '../components/UserLayout';
import { useNavigate } from "react-router-dom";
import {toast }from "react-toastify";
import { useSelector, useDispatch } from "react-redux";

import {useUploadavatarMutation} from '../slices/userApiSlice';
import { setCredentials } from "../slices/authSlice";

import default_avatar from '../images/default_avatar.jpg';

const UploadavatarPage = () => {
    const { userInfo } = useSelector((state) => state.auth);
  
    const [avatar, setAvatar] = useState("");
    const [avatarPreview, setAvatarPreview] = useState(
        userInfo?.avatar ? userInfo?.avatar?.url : default_avatar
    );
    
  
    const navigate = useNavigate();
    const dispatch = useDispatch()
  
    const [uploadAvatar, { isLoading, error, isSuccess }] = useUploadavatarMutation();
  
    useEffect(() => {
        
      if (error) {
        toast.error(error?.data?.message);
      }
  
      if (isSuccess) {
        toast.success("Avatar Uploaded");
        navigate("/me/profile");
      }
    }, [error, isSuccess]);
  
    const submitHandler = (e) => {
      e.preventDefault();
  
      const userData = {
        avatar,
      };
      
      uploadAvatar(userData);
    }; 
    // const submitHandler = async (e) => {
    //   e.preventDefault();
    //   try {
    //     const res = await uploadAvatar({ avatar}).unwrap();
    //     dispatch(setCredentials({...res}))
    //   } catch (error) {
    //     console.log(error)
    //   }
  
    // };
  
    const onChange = (e) => {
      const reader = new FileReader();
  
      reader.onload = () => {
        if (reader.readyState === 2) {
          setAvatarPreview(reader.result);
          setAvatar(reader.result);
        }
      };
  
      reader.readAsDataURL(e.target.files[0]);
    };
  
    return (
      <UserLayout>
        {/* <MetaData title={"Upload Avatar"} /> */}
        <div className="row wrapper">
          <div className="col-10 col-lg-8">
            <form className="shadow rounded bg-body" onSubmit={submitHandler}>
              <h2 className="mb-4">Upload Avatar</h2>
  
              <div className="mb-3">
                <div className="d-flex align-items-center">
                  <div className="me-3">
                    <figure className="avatar item-rtl">
                      <img
                        src={avatarPreview}
                        className="rounded-circle"
                        alt="image"
                      />
                    </figure>
                  </div>
                  <div className="input-foam">
                    <label className="form-label" htmlFor="customFile">
                      Choose Avatar
                    </label>
                    <input
                      type="file"
                      name="avatar"
                      className="form-control"
                      id="customFile"
                      accept="images/*"
                      onChange={onChange}
                    />
                  </div>
                </div>
              </div>
  
              <button
                id="register_button"
                type="submit"
                className="btn w-100 py-2"
                disabled={isLoading}
              >
                {isLoading ? "Uploading..." : "Upload"}
              </button>
            </form>
          </div>
        </div>
      </UserLayout>
    );
  };

export default UploadavatarPage;