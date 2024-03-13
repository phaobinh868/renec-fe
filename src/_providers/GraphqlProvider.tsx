'use client'
import { ReactNode, useMemo } from "react";
import {
    ApolloClient,
    InMemoryCache,
    ApolloProvider,
    FetchResult,
    ApolloLink,
    createHttpLink,
    GraphQLRequest,
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { Observable } from '@apollo/client/utilities';
import { GraphQLError } from 'graphql';
import { onError } from '@apollo/client/link/error';
import { getSessionFromStorage, signIn, signOut } from "@/_providers/SessionProvider";
import { Session } from "@/_types/auth";
import { gql_refreshToken } from "@/_gql-string/auth";
import { toast } from "react-toastify";


const httpLink = createHttpLink({
    uri: process.env.NEXT_PUBLIC_BASE_URL + "/graphql",
});

async function returnTokenDependingOnOperation(operation: GraphQLRequest) {
    const session = await getSessionFromStorage();
    if (!session.user) return null;
    if (operation.operationName === 'refreshToken')
        return session.refresh_token;
    else return session.access_token;
}
const authLink = setContext(async (operation, { headers }) => {
    let token = await returnTokenDependingOnOperation(operation);
    return {
        headers: {
            ...headers,
            authorization: token ? `Bearer ${token}` : '',
        },
    };
});
const errorLink = onError(
    ({ graphQLErrors, networkError, operation, forward }) => {
        if (graphQLErrors) {
            for (let err of graphQLErrors) {
                switch (err.message) {
                    case 'UNAUTHENTICATED':
                        if (operation.operationName === 'refreshToken') return;

                        const observable = new Observable<FetchResult<Record<string, any>>>(
                            (observer) => {
                                (async () => {
                                    try {
                                        const refreshed = await refreshToken();

                                        if (!refreshed) {
                                            throw new GraphQLError('Empty AccessToken');
                                        }

                                        const subscriber = {
                                            next: observer.next.bind(observer),
                                            error: observer.error.bind(observer),
                                            complete: observer.complete.bind(observer),
                                        };

                                        forward(operation).subscribe(subscriber);
                                    } catch (err) {
                                        observer.error(err);
                                    }
                                })();
                            }
                        );
                        return observable;
                    default:
                        toast.error(err.message);
                        break;
                }
            }
        }

        if (networkError) console.log(`[Network error]: ${networkError}`);
    }
);

const refreshToken = async () => {
    try {
        const refreshResolverResponse = await client.mutate<{
            refreshToken: Session;
        }>({
            mutation: gql_refreshToken,
        });

        if (refreshResolverResponse.data?.refreshToken) await signIn(refreshResolverResponse.data?.refreshToken);
        return true;
    } catch (err) {
        await signOut();
        return false;
    }
};

const client = new ApolloClient({
    link: ApolloLink.from([errorLink, authLink, httpLink]),
    cache: new InMemoryCache(),
});
interface Props {
    children: ReactNode;
}
const GraphqlProvider = ({ children }: Props) => {
    return (
        <ApolloProvider client={client}>
            {children}
        </ApolloProvider>);
};

export default GraphqlProvider;