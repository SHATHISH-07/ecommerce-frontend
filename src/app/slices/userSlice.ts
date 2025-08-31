import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface User {
    userId: string;
    name: string;
    username: string;
    email: string;
    phone: string;
    address: string;
    userOrderHistory: UserOrderHistory[];
    country: string;
    state: string;
    city: string;
    zipCode: string;
    role: string;
    emailVerified: boolean;
    isActive: boolean;
    isBanned: boolean;
    createdAt: string;
    updatedAt: string;
}

interface UserOrderHistory {
    orderId: string;
    placedAt: string;
}

interface UserState {
    user: User | null;
}

const initialState: UserState = {
    user: JSON.parse(localStorage.getItem("user") || "null"),
};

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setCurrentUser: (state, action: PayloadAction<User | null>) => {
            state.user = action.payload;
            localStorage.setItem("user", JSON.stringify(action.payload));
        },
        clearUser: (state) => {
            state.user = null;
            localStorage.removeItem("token");
            localStorage.removeItem("user");
        },
    },
});

export const { setCurrentUser, clearUser } = userSlice.actions;
export default userSlice.reducer;
