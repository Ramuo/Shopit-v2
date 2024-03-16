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
            providesTags: ['Products']
        }),
        submitReview: builder.mutation({
            query: (data) => ({
                url: `${PRODUCTS_URL}/reviews`,
                method: "PUT",
                body: data
            }),
            invalidatesTags: ['Products'],
        }),
        canUserReview: builder.query({
            query: (productId) => ({
                url: `${PRODUCTS_URL}/can_review/?productId=${productId}`
            }),
        }),
        getAllProduct: builder.query({
            query: () => ({
                url: `${PRODUCTS_URL}/products`
            }),
        }),
        newProduct: builder.mutation({
            query: (data) => ({
                url: `${PRODUCTS_URL}`,
                method: "POST",
                body: data
            }),
            invalidatesTags: ['Products'],
        }),
        updateProduct: builder.mutation({
            query: ({id, data}) => ({
                url: `${PRODUCTS_URL}/${id}`,
                method: "PUT",
                body: data
            }),
            invalidatesTags: ['Products'],
        }),
        uploadProductImages: builder.mutation({
            query: ({id, body}) => ({
                url: `${PRODUCTS_URL}/${id}/upload_images`,
                method: "PUT",
                body
            }),
            invalidatesTags: ['Products'],
        }),
    })
});



export const {
    useGetProductsQuery,
    useGetProductDetailsQuery,
    useSubmitReviewMutation,
    useCanUserReviewQuery,
    useGetAllProductQuery,
    useNewProductMutation,
    useUpdateProductMutation,
    useUploadProductImagesMutation,
} = productApiSlice;