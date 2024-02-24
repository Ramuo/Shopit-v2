import { apiSlice } from "./apiSlice";
import { USERS_URL } from "../constants";


export const userApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        login: builder.mutation({
            query: (data) => ({
                url: `${USERS_URL}/login`,
                method: 'POST',
                body: data
            }),
        }),
        register: builder.mutation({
            query: (data) => ({
                url: `${USERS_URL}/register`,
                method: 'POST',
                body: data
            }),
        }),
        logout: builder.mutation({
            query: () => ({
                url: `${USERS_URL}/logout`,
                method: 'POST',
            }),
        }),
        getUserProfile: builder.query({
            query: () => ({
                url: `${USERS_URL}/me`,
                // transFormResponse: (result) => result.userInfo,
                // async onQueryStarted(args, {dispatch, queryFulfilled}) {
                //     try {
                //         const {data} = await queryFulfilled;
                //         dispatch(setUser(data))
                //         dispatch(setUser(data))
                //     } catch (error) {
                //         console.log(error)
                //     }
                // }
            }),
        }),
    })
});



export const {
    useLoginMutation,
    useRegisterMutation,
    useLogoutMutation,
    useGetUserProfileQuery
} = userApiSlice;

