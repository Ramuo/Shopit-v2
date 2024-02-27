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
        updateProfile: builder.mutation({
            query: (data) => ({
                url: `${USERS_URL}/update`,
                method: 'PUT',
                body: data
            }),
            invalidatesTags: ['Users']
        }),
        uploadavatar: builder.mutation({
            query: (data) => ({
                url: `${USERS_URL}/uploadavatar`,
                method: 'PUT',
                body: data
            }),
            invalidatesTags: ['Users']
        }),
        forgotpassword: builder.mutation({
            query: (data) => ({
                url: `${USERS_URL}/forgotpassword`,
                method: 'POST',
                body: data
            }),
        }),
        resetpassword: builder.mutation({
            query: ({token, data}) => ({
                url: `${USERS_URL}/resetpassword/${token}`,
                method: 'PUT',
                body: data
            }),
        }),
    })
});



export const {
    useLoginMutation,
    useRegisterMutation,
    useLogoutMutation,
    useGetUserProfileQuery,
    useUpdateProfileMutation,
    useUploadavatarMutation,
    useForgotpasswordMutation,
    useResetpasswordMutation
} = userApiSlice;

