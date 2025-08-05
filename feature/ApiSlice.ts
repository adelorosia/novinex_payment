import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const apiSlice = createApi({
    reducerPath: 'pizzaApi',
    // baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:4005/api/v1' }),
    baseQuery: fetchBaseQuery({ 
        baseUrl: 'https://novinex-db.novinex.de/api',
        credentials: 'include',
        prepareHeaders: (headers) => {
            // اضافه کردن CORS headers
            headers.set('Access-Control-Allow-Origin', 'https://pay.novinex.de');
            headers.set('Access-Control-Allow-Credentials', 'true');
            headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
            headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
            return headers;
        },
    }),
    tagTypes: ["ORDER","PAYPAL","STRIPE"],
    endpoints: () => ({})
})
