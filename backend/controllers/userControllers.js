import crypto from 'crypto';
import User from '../models/userModel.js';
import asyncHandler from '../middlewares/asyncHandler.js';
import generateToken from '../utils/generateToken.js';
import sendEmail from '../utils/sendEmail.js';


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
        role: user.role
    })
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

// @desc    Forgot Password
// @route   POST /api/users/forgotpassword
// @access  Public
const forgotPassword = asyncHandler(async (req, res) => {
    const user = await User.findOne({email: req.body.email});

    if(!user){
        res.status(404);
        throw new Error("Aucun utilisateur trouvé avec cet email")
    };

    //Get reset Token
    const resetToken = user.getResetTokenPassword();

    await user.save({validateBeforeSave: false});

    const resetUrl = `${req.protocol}://${req.get('host')}/api/users/resetpassword/${resetToken}`;

    const message = `
                You are recieving this email because you
                you have requested to reset your password. Please Put request to:\n\n ${resetUrl}`// It should be a frontend link
    
    
    try {
        await sendEmail({
            email: user.email,
            subject: 'Reset Password',
            message
        });

        res.status(200).json({success: true, data: "Email sent"});
    } catch (err) {
        console.log(err);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save({validateBeforeSave: false});

        res.status(500);
        throw new Error("Email could not be sent");
    };
});

// @desc    Reset Password
// @route   POST /api/users/resetpassword/:resettoken
// @access  Public
const resetpassword = asyncHandler( async (req, res) => {
    //Get hashed token
    const resetPasswordToken = crypto
        .createHash('sha256')
        .update(req.params.resettoken)
        .digest('hex');


    //Find the user by resettoken only if the expiration is greatter than right now
    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: {$gt: Date.now()}
    });

    if(!user){
        res.status(400);
        throw new Error("Invalid Token")
    };

    //If we find the user & the token is not expired, then set new Password 
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    generateToken(res, user._id)

    res.status(200).json(user);
});

export {
   loginUser,
   registerUser,
   logoutUser,
   forgotPassword,
   resetpassword
}

