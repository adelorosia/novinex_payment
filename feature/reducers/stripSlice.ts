import { IOrder } from "@/interface";
import { createSlice, createEntityAdapter, EntityState } from "@reduxjs/toolkit";
import { apiSlice } from "../ApiSlice";

// Entity adapter برای ذخیره سفارش‌ها (در صورت نیاز)
const StripeAdapter = createEntityAdapter<IOrder, string>({
  selectId: (order) => order._id,
});

const initialState: EntityState<IOrder, string> = StripeAdapter.getInitialState();

export const extendedApiStripeSlice = apiSlice.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    verifyStripePayment: builder.query<IOrder, { sessionId: string }>({
      query: ({ sessionId }) => ({
        url: `/api/order/payment/verify/stripe?sessionId=${sessionId}`,
        method: "GET",
      }),
      transformResponse: (response: any) => {
        if (response.success) return response.data;
        throw new Error(response.error || "Stripe-Verifikation fehlgeschlagen");
      },
    }),
  }),
});

const stripeSlice = createSlice({
  name: "stripe",
  initialState,
  reducers: {},
});

export const { useVerifyStripePaymentQuery } = extendedApiStripeSlice;
export default stripeSlice.reducer;