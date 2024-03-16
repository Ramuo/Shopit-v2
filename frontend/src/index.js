import React from 'react';
import ReactDOM from 'react-dom/client';
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider
} from 'react-router-dom';
import {Provider} from 'react-redux';
import store from './store';
// import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import App from './App';


import PrivateRoute from './components/PrivateRoute';
import AdminRoutes from './components/AdminRoutes';

import HomePage from './pages/HomePage';
import ProductPage from './pages/ProductPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import UpdateProfilePage from './pages/UpdateProfilePage';
import UploadavatarPage from './pages/UploadavatarPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import CartPage from './pages/CartPage';
import ShippingPage from './pages/ShippingPage';
import ConfirmOrderPage from './pages/ConfirmOrderPage';
import PaymentMethodPage from './pages/PaymentMethodPage';
import MyOdersPage from './pages/MyOdersPage';
import OrderDetailsPage from './pages/OrderDetailsPage';
import InvoicePage from './pages/InvoicePage';

import DasboardPage from './pages/admin/DasboardPage';
import ListProductPage from './pages/admin/ListProductPage';
import NewProductPage from './pages/admin/NewProductPage';
import UpdateProductPag from './pages/admin/UpdateProductPage';
import UploadImages from './components/UploadImages';

//ROUTES
const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<App/>}>
      <Route index={true} path='/' element={<HomePage/>}/>
      <Route path='/product/:id' element={<ProductPage/>}/>
      <Route path='/login' element={<LoginPage/>}/>
      <Route path='/register' element={<RegisterPage/>}/>
      <Route path='/forgotpassword' element={<ForgotPasswordPage/>}/>
      <Route path='/resetpassword/:token' element={<ResetPasswordPage/>}/>
     
      {/* User Roures */}
      <Route path='' element={<PrivateRoute/>}>
        <Route path='/me/profile' element={<ProfilePage/>}/>
        <Route path='/me/updateprofile' element={<UpdateProfilePage/>}/>
        <Route path='/me/uploadavatar' element={<UploadavatarPage/>}/>
        <Route path='/cart' element={<CartPage/>}/>
        <Route path='/shipping' element={<ShippingPage/>}/>
        <Route path='/confirm_order' element={<ConfirmOrderPage/>}/>
        <Route path='/payment_method' element={<PaymentMethodPage/>}/>
        <Route path='/orders' element={<MyOdersPage/>}/>
        <Route path='/order/:id' element={<OrderDetailsPage/>}/>
        <Route path='/invoice/order/:id' element={<InvoicePage/>}/>
      </Route>

        {/* Admin Routes */}
      <Route path='' element={<AdminRoutes/>}>
        <Route path='/admin/dashboard' element={<DasboardPage/>}/>
        <Route path='/admin/products' element={<ListProductPage/>}/>
        <Route path='/admin/product/new' element={<NewProductPage/>}/>
        <Route path='/admin/products/:id' element={<UpdateProductPag/>}/>
        <Route path='/admin/products/:id/upload_images' element={<UploadImages/>}/>
      </Route>
    </Route>
  )
);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
   <Provider store={store}>
      <RouterProvider router={router}/>
   </Provider>
  </React.StrictMode>
);


