import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
export const apiSlice = createApi({

    reducerPath: 'pizzaApi',
    // baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:4005/api/v1' }),
    baseQuery: fetchBaseQuery({ baseUrl: 'https://novinex-db.novinex.de/api'}),
    tagTypes: ["ORDER","PAYPAL","STRIPE"],
    endpoints: () => ({})
})
