import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const apiSlice = createApi({
    reducerPath: 'pizzaApi',
    baseQuery: fetchBaseQuery({ 
        // baseUrl: 'http://localhost:9005',
        baseUrl: 'https://novinex-db.novinex.de', // استفاده از relative URL برای proxy API
        credentials: 'include',
        prepareHeaders: (headers) => {
            headers.set('Accept', 'application/json');
            return headers;
        },
    }),
    tagTypes: ["ORDER","PAYPAL","STRIPE","RESTAURANT"],
    endpoints: () => ({})
})
