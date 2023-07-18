import { configureStore } from "@reduxjs/toolkit";
import { apiSlice } from "./slices/apiSlice";
import cartSliceReducer from "./slices/cartSlice";
import authSliceReducer from "./slices/authSlice";



const store = configureStore({
    reducer: {
        // Add the generated reducer as a specific top-level slice
        [apiSlice.reducerPath]: apiSlice.reducer,
        cart: cartSliceReducer,
        auth: authSliceReducer
      },
      // Adding the api middleware enables caching, invalidation, polling,
      // and other useful features of `rtk-query`.
      middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(apiSlice.middleware),
      devTools: true,
})

export default store;