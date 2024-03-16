import { apiSlice } from "./apiSlice";
import { ORDERS_URL, STRIPE_URL } from "../constants";


export const orderApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        newOrder: builder.mutation({
            query: (data) => ({
                url: `${ORDERS_URL}/new`,
                method: 'POST',
                body: data
            }),
        }),
        stripeCheckoutSession: builder.mutation({
            query: (data) => ({
                url: `${STRIPE_URL}/checkout_session`,
                method: 'POST',
                body: data
            }),
        }),
        myOrders: builder.query({
            query: () => ({
                url: `${ORDERS_URL}/orders`,
            }),
            keepUnusedDataFor: 5,
        }),
        getOrderDetails: builder.query({
            query: (id) => ({
                url: `${ORDERS_URL}/${id}`,
            }),
            keepUnusedDataFor: 5,
        }),
        getSales: builder.query({
            query: ({startDate, endDate}) => ({
                url: `${ORDERS_URL}/get_sales/?startDate=${startDate}&endDate=${endDate}`,
            }),
            keepUnusedDataFor: 5,
        }),
        getAllOrders: builder.query({
            query: () => ({
                url: `${ORDERS_URL}/orders`,
            }),
            keepUnusedDataFor: 5,
        }),
        updateOrder: builder.mutation({
            query: ({id, data}) => ({
                url: `${ORDERS_URL}/${id}`,
                method: 'PUT',
                body: data
            }),
        })
    })
});



export const {
    useNewOrderMutation,
    useStripeCheckoutSessionMutation,
    useMyOrdersQuery,
    useGetOrderDetailsQuery,
    useLazyGetSalesQuery,
    useGetAllOrdersQuery,
    useUpdateOrderMutation,
} = orderApiSlice;