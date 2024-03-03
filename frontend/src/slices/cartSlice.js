import { createSlice } from "@reduxjs/toolkit";

// const initialState ={
//     cartItems: localStorage.getItem('cartItems')
//      ? JSON.parse(localStorage.getItem('cartItems'))
//      : []
// }

const initialState = localStorage.getItem('cart')
  ? JSON.parse(localStorage.getItem('cart'))
  : { cartItems: [] };


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
    }
});


export const {
    setCartItem,
    removeFromCart,
} = cartSlice.actions;

export default cartSlice.reducer;