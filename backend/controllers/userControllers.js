import crypto from 'crypto';
import User from '../models/userModel.js';
import asyncHandler from '../middlewares/asyncHandler.js';
import generateToken from '../utils/generateToken.js';
import sendEmail from '../utils/sendEmail.js';
import { getResetPasswordTemplate } from '../utils/emailTemplates.js';
import {delete_file, upload_file} from '../utils/cloudinary.js';


//@desc     Get all users
//@route    GET /api/users
//@access   Private/Admin
const getUsers = asyncHandler(async(req, res) => {
    const users = await User.find({});

    res.status(200).json({
        users
    });
    
});


//@desc     Register new user (signup)
 //@route    POST /api/users
 //@access   Public
 const registerUser = asyncHandler(async(req, res) => {
   const {name, email, password} = req.body;

   // Find user by email
   const userExist = await User.findOne({ email });

   // Check if user exist alredy
   if(userExist){
       res.status(400);
       throw new Error("L'utilistaur existe déjà")
   };

   //To create new user it does'nt exist
   const user = await User.create({
       name,
       email,
       password
   });

   //Once user created, then set it into db
   if(user){
       generateToken(res, user._id);

       res.status(201).json({
           _id: user._id,
           name: user.name,
           email: user.email,
           role: user.role
       });
   }else{
       res.status(400);
       throw new Error("Information invalide")
   };

});

//@desc     Login user & and get the token (signin)
//@route    POST /api/users/login
//@access   Public
const loginUser = asyncHandler(async(req, res) => {
   const {email, password} = req.body;

   //Let us find a user
   const user = await User.findOne({ email });

   // Let's validate user cedentials
   if(user && (await user.matchPassword(password))){
    generateToken(res, user._id);

    res.status(200).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar.url
     
    });
   }else{
    res.status(401);
    throw new Error("Email ou mot de passe invalide");
   }
});
 

// @desc    Logout user / clear cookie
// @route   POST /api/users/logout
// @access  Public
const logoutUser = (req, res) => {
   res.clearCookie('jwt');
   res.status(200).json({ message: 'Logged out successfully' });
};

// @desc      Get current logged in user profile
// @route     GET /api/users/me
// @access    Private
const getUserProfile = asyncHandler(async(req, res) => {
    const user = await User.findById(req.user.id);

    res.status(200).json({
        user 
    })
});


// @desc      Update password
// @route     PUT /api/auth/updatepassword
// @access    Private
const  updateUserPassword = asyncHandler(async(req, res) => {
    const user = await User.findById(req?.user?._id).select("+password");

  // Check the previous user password
  const isPasswordMatched = await user.matchPassword(req.body.oldPassword);

  if (!isPasswordMatched) {
    res.status(404);
    throw new Error("Old Password is incorrect") 
  }

  user.password = req.body.password;
  user.save();

  res.status(200).json({
    success: true,
  });
});


//@desc     Update user 
//@route    PUT /api/users/update
//@access   Private/admin
const updateProfile = asyncHandler(async(req, res) => {
    const newUserData = {
        name: req.body.name,
        email: req.body.email,
    };
    
    const user = await User.findByIdAndUpdate(req.user._id, newUserData, {
    new: true,
    });
    
    res.status(200).json({
    user,
    });
});

//@desc     Upload user avatar
//@route    PUT /api/users/uploadavatar
//@access   Private/admin
const updloadAvatar = asyncHandler(async(req, res) => {
    const avatarResponse = await upload_file(req.body.avatar, "shopit/avatars");

    if(req?.user?.avatar?.url){
        await delete_file(req?.user?.avatar?.public_id)
    }

    const user = await User.findByIdAndUpdate(req?.user?._id, {
        avatar: avatarResponse,
    });
    
    res.status(200).json({user});
});




// @desc      Forgot password
// @route     POST /api/auth/forgotpassword
// @access    Public
const forgotPassword = asyncHandler(async(req, res) => {
    const user = await User.findOne({email: req.body.email});

    if(!user){
        res.status(404);
        throw new Error("There is no user with that email");
    };

    //Get reset token 
    const resetToken = user.getResetTokenPassword();
    console.log(resetToken); 

    await user.save({validateBeforeSave: false});

    //Create reset Url
    const resetUrl = `${process.env.FRONTEND_URL}/resetpassword/${resetToken}`;

    const message = getResetPasswordTemplate(user?.name, resetUrl);

                
    //Sending Email
    try {
        await sendEmail({
            email: user.email,
            subject: 'Password reset token',
            message
        });

        res.status(200).json({
            success: true,
            data: "Email sent"
        });
    } catch (error) {
        console.log(error);
        user.resetPasswordToken = undefined,
        user.resetPasswordExpire = undefined

        await user.save({validateBeforeSave: false});

        res.status(500);
        throw new Error("Email could not be sent")
    };
});

// @desc      Reset password
// @route     PUT /api/auth/resetpassword/:resettoken
// @access    Public
const  resetpassword = asyncHandler(async(req, res) => {
    //Get hashed token
    const resetPasswordToken = crypto
        .createHash('sha256')
        .update(req.params.resettoken)
        .digest('hex');

    //Find the user by resettoken only if the expiration is greatter than right now
    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: {$gt: Date.now()} //Expiry is greatter than right now
    });


    if(!user){
        res.status(400);
        throw new Error("Invalid Token")
    };

    //If we find the user & the token is not expired, then set new Password 
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    
    console.log( user.password)

    await user.save();

    generateToken(res, user._id);

    res.status(200).json({
        _id: user._id,
        email: user.email,
        password: user.password
    });
});



//@desc     Get user by ID
//@route    GET /api/users/:id
//@access   Private/Admin
const getUserDetails = asyncHandler(async(req, res) => {
    const user = await User.findById(req.params.id).select('-password');

    if(user){
        res.status(200).json({user})
    }else{
        res.status(404);
        throw new Error('Utilisateur non trouvé');
    }
});

////////////ONLY FOR ADMIN////////////////
//@desc     Update user by admin
//@route    PUT /api/users/:id
//@access   Private/Admin
const updateUser = asyncHandler(async(req, res) => {
    const newUserData = {
        name: req.body.name,
        email: req.body.email,
        role: req.body.role,
    };
    
    const user = await User.findByIdAndUpdate(req.params.id, newUserData, {
    new: true,
    });

    res.status(200).json({
    user,
    });
});

//@desc     Delete user by admin
//@route    DELETE /api/users/:id
//@access   Private/Admin
const deleteUser = asyncHandler(async(req, res) => {
    const user = await User.findById(req.params.id);

    if (!user) {
        res.status(404);
        throw new Error(`Aucun utilisateur trouver avec cet ID: ${req.params.id}`);
    }
  
    // Remove user avatar from cloudinary
    // if (user?.avatar?.public_id) {
    //   await delete_file(user?.avatar?.public_id);
    // }
  
    await user.deleteOne();
  
    res.status(200).json({
      success: true,
    });
});



export {
    getUsers,
   loginUser,
   registerUser,
   logoutUser,
   getUserProfile,
   updateProfile,
   updateUserPassword,
   forgotPassword,
   resetpassword,
   getUserDetails,
   updateUser,
   deleteUser,
   updloadAvatar,
}



  // const resetUrl = `${req.protocol}://${req.get('host')}/api/users/resetpassword/${resetToken}`;