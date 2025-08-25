// src/apollo/client.ts
import { ApolloClient, InMemoryCache, createHttpLink } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";

// GraphQL endpoint
const httpLink = createHttpLink({
    uri: "http://localhost:4000/graphql", // or your production endpoint
});

// Attach token from localStorage to every request
const authLink = setContext((_, { headers }) => {
    const token = localStorage.getItem("token");
    return {
        headers: {
            ...headers,
            authorization: token ? `Bearer ${token}` : "",
        },
    };
});

// Apollo Client
export const client = new ApolloClient({
    link: authLink.concat(httpLink), // authLink first, then httpLink
    cache: new InMemoryCache(),
});
