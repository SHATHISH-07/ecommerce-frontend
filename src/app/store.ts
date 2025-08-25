import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slices/userSlice";
import { useDispatch, type TypedUseSelectorHook } from "react-redux";
import { useSelector } from "react-redux";

export const store = configureStore({
    reducer: {
        user: userReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch: () => AppDispatch = () => {
    return useDispatch<AppDispatch>();
};
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;