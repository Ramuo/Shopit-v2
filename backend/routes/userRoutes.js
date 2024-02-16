import express from 'express';
import {
    registerUser,
    loginUser,
    logoutUser,
    forgotPassword,
    resetpassword
} from '../controllers/userControllers.js';




const router = express.Router();

router.route('/register').post(registerUser);
router.route('/login').post(loginUser);
router.route('/logout').post(logoutUser);
router.route('/forgotpassword').post(forgotPassword );
router.route('/resetpassword/:resettoken').put(resetpassword );



export default router;


