import User from '../models/userModel.js';
import asyncHandler from '../middlewares/asyncHandler.js';
import generateToken from '../utils/generateToken.js'


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

export {
   loginUser,
   registerUser,
   logoutUser,
}

