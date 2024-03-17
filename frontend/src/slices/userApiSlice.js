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
            query: (data) => ({
                url: `${USERS_URL}/resetpassword/${data.token}`,
                method: 'PUT',
                body: data,
            }),
            invalidatesTags: ['Users'],
        }),
        getAllUsers: builder.query({
            query: () => ({
                url: USERS_URL
            }),
            providesTags: ['Users'],
            keepUnusedDataFor: 5,
        }),
        deleteUser: builder.mutation({
            query: (id) => ({
              url: `${USERS_URL}/${id}`,
              method: 'DELETE',
            }),
        }),
        getUserDetails: builder.query({
            query: (userId) => ({
                url: `${USERS_URL}/${userId}`
            }),
            keepUnusedDataFor: 5,
            providesTags: ['Users']
        }),
        updateUser: builder.mutation({
            query: ({id, body}) => ({
                url: `${USERS_URL}/${id}`,
                method: 'PUT',
                body,
            }),
            invalidateTags: ['Users'],
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
    useResetpasswordMutation,
    useGetAllUsersQuery,
    useDeleteUserMutation,
    useGetUserDetailsQuery,
    useUpdateUserMutation
} = userApiSlice;

