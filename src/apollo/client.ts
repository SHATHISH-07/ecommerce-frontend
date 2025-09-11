import { ApolloClient, InMemoryCache, from } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { onError } from "@apollo/client/link/error";
import { createUploadLink } from "apollo-upload-client";

// GraphQL endpoint with upload support
const uploadLink = createUploadLink({
    uri: "https://ecommerce-backend-j210.onrender.com/graphql",
    // uri: "http://localhost:4000/graphql",
});

// Auth link
const authLink = setContext((_, { headers }) => {
    const token = localStorage.getItem("token");
    return {
        headers: {
            ...headers,
            authorization: token ? `Bearer ${token}` : "",
        },
    };
});

// Error handling link
const errorLink = onError(({ graphQLErrors, networkError }) => {
    if (graphQLErrors) {
        graphQLErrors.forEach((err) => {
            if (err.extensions?.code === "UNAUTHENTICATED") {
                localStorage.removeItem("token");
                import("../app/store").then(({ store }) => {
                    import("../app/slices/userSlice").then(({ clearUser }) => {
                        store.dispatch(clearUser());
                    });
                });
                window.location.href = "/login";
            }
        });
    }

    if (networkError) {
        console.error("Network error:", networkError);
    }
});

// Apollo Client instance
export const client = new ApolloClient({
    link: from([errorLink, authLink.concat(uploadLink)]), // ✅ use uploadLink instead of httpLink
    cache: new InMemoryCache(),
});
