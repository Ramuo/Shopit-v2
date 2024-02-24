import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';
import {BASE_URL} from '../constants';

import {logout} from './authSlice';
// NOTE: To handle when our JWT and Cookie expire.
// We need to customize the baseQuery to be able to intercept any 401 responses
// and log the user out


const baseQuery = fetchBaseQuery({
    baseUrl: BASE_URL
});


async function baseQueryWithAuth(args, api, extra) {
    const result = await baseQuery(args, api, extra);
    // Dispatch the logout action on 401.
    if (result.error && result.error.status === 401) {
      api.dispatch(logout());
    }
    return result;
}

export const apiSlice = createApi({
    baseQuery: baseQueryWithAuth, // Use the customized baseQuery
    tagTypes: ['Products', "Users", 'Orders'],
    endpoints: (builder) => ({}),
});