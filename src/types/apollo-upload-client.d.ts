declare module "apollo-upload-client" {
    import { ApolloLink } from "@apollo/client";

    export interface UploadLinkOptions {
        uri?: string;
        headers?: Record<string, string>; // <-- use string instead of any
        credentials?: string;
        fetch?: typeof fetch;
    }

    export function createUploadLink(options?: UploadLinkOptions): ApolloLink;
}
