import { apiSlice } from "./apiSlice";
import { PRODUCTS_URL } from "../constants";


export const productApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getProducts: builder.query({
            query: (params) => ({
              url: PRODUCTS_URL,
              params: {
                page: params?.page,
                keyword: params?.keyword,
                category: params?.category,
                "price[gte]" : params?.min,
                "price[lte]" : params?.max,
                "ratings[gte]" : params?.ratings,
            } 
            }),
            keepUnusedDataFor: 5,
            providesTags: ['Products']
        }),
        getProductDetails: builder.query({
            query: (productId) => ({
                url: `${PRODUCTS_URL}/${productId}`,
            }),
            keepUnusedDataFor: 5,
        }),
    })
});



export const {
    useGetProductsQuery,
    useGetProductDetailsQuery
} = productApiSlice;