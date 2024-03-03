import crypto from "crypto";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";


const userSchema = new mongoose.Schema(
    {
      name: {
        type: String,
        required: [true, "Please enter your name"],
        maxLength: [50, "Your name cannot exceed 50 characters"],
      },
      email: {
        type: String,
        required: [true, "Please enter your email"],
        unique: true,
      },
      password: {
        type: String,
        required: [true, "Please enter your password"],
        minLength: [6, "Your password must be longer than 6 characters"],
      },
      avatar: {
        public_id: String,
        url: String,
      },
      role: {
        type: String,
        default: "user",
      },
      resetPasswordToken: String,
      resetPasswordExpire: Date,
    },
    { timestamps: true }
);


//TO AUTHANTICATE USER PASSWORD
userSchema.methods.matchPassword = async function(enteredPassword){
  return await bcrypt.compare(enteredPassword, this.password);
};

//TO CRYPT PASSWORD WHEN REGISTERING NEW USER AND HASH IT
userSchema.pre("save", async function(next){
  if(!this.isModified('password')){
    next();
  };

  const salt = await bcrypt.genSalt(10); 
  this.password = await bcrypt.hash(this.password, salt);
});


//Generate and hash password Token
userSchema.methods.getResetTokenPassword = function (){
  //Generate Token
  const resetToken = crypto.randomBytes(20).toString('hex');

  //Hash token and set it to resetPasswordToken field
  this.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex')
  
  //Set token expiry
  this.resetPasswordExpire = Date.now() + 30 * 60 * 1000; // 10mn

  return resetToken;
};

const User = mongoose.model('User', userSchema);
export default User;