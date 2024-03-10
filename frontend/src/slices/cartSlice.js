import { createSlice } from "@reduxjs/toolkit";

const initialState ={
    cartItems: localStorage.getItem('cartItems')
     ? JSON.parse(localStorage.getItem('cartItems'))
     : [],

     shippingInfo: localStorage.getItem('shippingInfo')
        ? JSON.parse(localStorage.getItem('shippingInfo'))
        : {},
}

// const initialState = localStorage.getItem('cart')
//   ? JSON.parse(localStorage.getItem('cart'))
//   : { cartItems: [] };


const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        setCartItem: (state, action) => {
            const item = action.payload;

            //Let's check if the item is already in the cart
            const existItem = state.cartItems.find((i) => i.product === item.product);

            if(existItem){
                state.cartItems = state.cartItems.map((i) => 
                    i.product === existItem.product ? item : i
                );
            }else{
                //We add the new item to the item already there
                state.cartItems = [...state.cartItems, item];
            };

            localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
        },
        removeFromCart: (state, action) => {
            state.cartItems = state?.cartItems?.filter((i) => 
                i?.product !== action.payload);
            
                localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
        },
        saveShippingInfo: (state, action) => {
            state.shippingInfo = action.payload;
            localStorage.setItem('shippingInfo', JSON.stringify(state))
        },
        clearCart: (state, action) => {
            localStorage.removeItem("cartItems");
            state.cartItems = [];
        },
    }
});


export const {
    setCartItem,
    removeFromCart,
    saveShippingInfo,
    clearCart
} = cartSlice.actions;

export default cartSlice.reducer;