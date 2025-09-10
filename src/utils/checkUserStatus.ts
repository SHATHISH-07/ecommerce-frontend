// utils/checkUserStatus.ts
import { ApolloClient } from "@apollo/client";
import { GET_CURRENT_USER } from "../graphql/queries/user.query";
import { store } from "../app/store";
import { clearUser } from "../app/slices/userSlice";

export async function checkUserStatus(apolloClient: ApolloClient<object>) {
    try {
        const { data } = await apolloClient.query({
            query: GET_CURRENT_USER,
            fetchPolicy: "network-only",
        });

        const user = data?.getCurrentUser;

        if (!user || !user.isActive || user.isBanned) {
            store.dispatch(clearUser());
            localStorage.removeItem("token");

            window.location.href = "/ecommerce-frontend/#/login";
            return false;
        }

        return true;
    } catch (error) {
        console.error("Failed to check user status:", error);
        return false;
    }
}
