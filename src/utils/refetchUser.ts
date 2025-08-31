import { ApolloClient } from "@apollo/client";
import { GET_CURRENT_USER } from "../graphql/queries/user.query";
import { setCurrentUser } from "../app/slices/userSlice";
import { type AppDispatch } from "../app/store";

export const refetchAndStoreUser = async (
    client: ApolloClient<object>,
    dispatch: AppDispatch
) => {
    try {
        const { data } = await client.query({
            query: GET_CURRENT_USER,
            fetchPolicy: "network-only",
        });

        if (data?.getCurrentUser) {
            dispatch(setCurrentUser(data.getCurrentUser));
        }
    } catch (err) {
        console.error("Failed to refetch current user:", err);
    }
};
