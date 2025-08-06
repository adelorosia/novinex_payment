import {
  createEntityAdapter,
  createSelector,
  createSlice,
  EntityState,
} from "@reduxjs/toolkit";
import { apiSlice } from "../ApiSlice";
import { IRestaurant } from "@/interface";
import { RootState } from "../store";

interface IRestaurantState {
  
}
const RestaurantAdapter = createEntityAdapter<IRestaurant, string>({
  selectId: (restaurant) => restaurant._id,
});

const initialState: IRestaurantState & EntityState<IRestaurant, string> =
  RestaurantAdapter.getInitialState({
  });

export const extendedApiRestaurantSlice = apiSlice.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getRestaurant: builder.query({
      query: () => "/api/restaurant",
      transformResponse: (responseData: IRestaurant[]) => {
        return RestaurantAdapter.setAll(initialState, responseData);
      },
      providesTags: ["RESTAURANT"],
    }),
  }),
});

const restaurantSlice = createSlice({
  name: "restaurant",
  initialState,
  reducers: {

  },
});
export const selectRestaurantResult =
  extendedApiRestaurantSlice.endpoints.getRestaurant.select("RESTAURANT");
const selectRestaurantData = createSelector(
  selectRestaurantResult,
  (restaurantResult) => restaurantResult.data
);
export const { selectAll: displayRestaurants, selectById: displayRestaurant } =
  RestaurantAdapter.getSelectors(
    (state: RootState) => selectRestaurantData(state) ?? initialState
  );

export const { useGetRestaurantQuery } = extendedApiRestaurantSlice;

export const { } = restaurantSlice.actions;
export default restaurantSlice.reducer;
