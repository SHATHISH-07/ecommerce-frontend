import { useEffect, useState } from "react";
import { useApolloClient } from "@apollo/client";
import { useAppDispatch, useAppSelector } from "../app/store";
import { setCurrentUser } from "../app/slices/userSlice";
import { GET_CURRENT_USER } from "../graphql/queries/user.query";

export const useAuth = () => {
    const client = useApolloClient();
    const dispatch = useAppDispatch();
    const user = useAppSelector((state) => state.user.user);

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (token && !user) {
            client
                .query({ query: GET_CURRENT_USER, fetchPolicy: "network-only" })
                .then(({ data }) => {
                    if (data?.getCurrentUser) {
                        dispatch(setCurrentUser(data.getCurrentUser));
                    }
                })
                .catch((err) => {
                    console.warn("Could not fetch user, keeping local state.", err);
                })
                .finally(() => {
                    setLoading(false);
                });
        } else {
            setLoading(false);
        }
    }, [client, dispatch, user]);

    return { user, loading };
};
