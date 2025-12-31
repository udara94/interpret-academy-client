import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./slices/auth-slice";
import membershipSlice from "./slices/membership-slice";

export const makeStore = () => {
  return configureStore({
    reducer: {
      auth: authSlice,
      membership: membershipSlice,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: false,
      }),
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];



