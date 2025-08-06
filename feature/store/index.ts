import { configureStore } from "@reduxjs/toolkit";
import { apiSlice } from "../ApiSlice";
import restaurantReducer, {
  extendedApiRestaurantSlice,
} from "../reducers/restaurantSlice";

export const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    restaurant: restaurantReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(apiSlice.middleware)
});
store.dispatch(
  extendedApiRestaurantSlice.endpoints.getRestaurant.initiate("RESTAURANT")
);
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

