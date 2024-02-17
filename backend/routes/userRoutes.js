import express from 'express';
import {
    getUsers,
    registerUser,
    loginUser,
    logoutUser,
    getUserProfile,
    updateUserPassword,
    updateProfile,
    forgotPassword,
    resetpassword,
    getUserDetails,
    updateUser,
    deleteUser
} from '../controllers/userControllers.js';

import {protect, authorize} from '../middlewares/authMiddleware.js';
import checkObjectId from '../middlewares/checkObjectId.js'



const router = express.Router();

router.route('/').get(protect, authorize("admin"), getUsers);
router.route('/register').post(registerUser);
router.route('/login').post(loginUser);
router.route('/logout').post(logoutUser);
router.route('/me').get(protect, getUserProfile);
router.route('/updatepassword').put(protect, updateUserPassword);
router.route('/update').put(protect,  updateProfile);
router.route('/forgotpassword').post(forgotPassword );
router.route('/resetpassword/:resettoken').put(resetpassword );
router.route('/:id')
    .get(protect, authorize("admin"), checkObjectId, getUserDetails)
    .put(protect, authorize("admin"), checkObjectId, updateUser)
    .delete(protect, authorize("admin"), checkObjectId, deleteUser);



export default router;


