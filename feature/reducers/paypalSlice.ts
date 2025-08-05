
import { IOrder, TOrder } from "@/interface";
import {
    createEntityAdapter,
    createSlice,
    EntityState,
} from "@reduxjs/toolkit";
import { apiSlice } from "../ApiSlice";



interface IOrderState { }
const OrderAdapter = createEntityAdapter<IOrder, string>({
    selectId: (order) => order._id,
});

const initialState: IOrderState & EntityState<IOrder, string> =
    OrderAdapter.getInitialState({});

export const extendedApiOrderSlice = apiSlice.injectEndpoints({
    overrideExisting: true,
    endpoints: (builder) => ({

       
        verifyPayPalPayment: builder.query<any, { token: string }>({
            query: ({ token }) => ({
              url: `/payment/verify/paypal?token=${token}`,
              method: "GET",
            }),
          }),
    }),
});

const orderSlice = createSlice({
    name: "paypal",
    initialState,
    reducers: {},
});


export const {
   useVerifyPayPalPaymentQuery
} = extendedApiOrderSlice;

export const { } = orderSlice.actions;
export default orderSlice.reducer;
