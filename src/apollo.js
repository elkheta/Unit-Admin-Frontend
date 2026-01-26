import { ApolloClient, InMemoryCache, createHttpLink, from, ApolloLink } from '@apollo/client';
import { onError } from '@apollo/client/link/error';
import { setContext } from '@apollo/client/link/context';
import { provideApolloClient } from '@vue/apollo-composable';
import { authStorage } from '../utils/authStorage.js';
import router from '../router/index.js';
import { useLoader } from '../composables/useLoader'; // Import useLoader

/**
 * HTTP Link for GraphQL endpoint
 */
const httpLink = createHttpLink({
  uri: import.meta.env.VITE_GRAPHQL_ENDPOINT || 'http://127.0.0.1:8000/graphql',
});

/**
 * Loader Link
 */
const loaderLink = new ApolloLink((operation, forward) => {
  const { start, stop } = useLoader();
  start();
  return forward(operation).map((response) => {
    stop();
    return response;
  });
});

/**
 * Auth Link to add authentication headers
 */
const authLink = setContext((_, { headers }) => {
  const token = authStorage.getToken();

  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    }
  };
});

/**
 * Error Link to handle authentication errors
 */
const errorLink = onError(({ graphQLErrors, networkError }) => {
  const { stop } = useLoader();
  stop(); // Ensure loader stops on error

  if (!graphQLErrors || !graphQLErrors.length) return;

  const shouldLogout = graphQLErrors.some((error) => {
    const code = error?.extensions?.message_code || error?.message_code;
    return code === 'LOGIN_REQUIRED';
  });

  if (shouldLogout) {
    authStorage.removeToken();
    authStorage.removeUser?.();
    const currentPath = router.currentRoute.value?.path;
    if (currentPath !== '/signin') {
      router.push('/signin');
    }
  }
});

// Duplicate definition removed

// Since map doesn't catch network errors, we need error handling for stop too.
// Actually, using a fuller formatting:
const loaderLinkWithErrors = new ApolloLink((operation, forward) => {
  const { start, stop } = useLoader();
  start();

  return forward(operation).map((data) => {
    stop();
    return data;
  }).map((data) => { return data; }); // Just pass through
  // Note: Standard ApolloLink doesn't have .catch. 
  // We need to use onError link or ensure this link handles completion/error?
  // Usually errorLink handles errors. We should call stop() in errorLink too?
  // OR we use a link that uses Observable.
});

// Better implementation using Observable pattern if needed, or simpler: 
// relying on `onError` for error cases and this for success?
// Let's look at `onError` link. It runs on graphQLErrors and networkErrors.
// I'll modify `errorLink` to stop loader, and `loaderLink` to start it and stop on success.
// But we need to ensure stop is called even on network error if `errorLink` doesn't catch it all? 
// `onError` catches network errors too.
// Let's keep it simple: Start in a link at the beginning. Stop in a link at the end (or map) AND in errorLink.

// Re-writing the plan for file content:
// 1. Import ApolloLink
// 2. Define loadingLink that starts loader.
// 3. Define finishing logic?
// easier: 
/*
const loadingLink = new ApolloLink((operation, forward) => {
  const { start, stop } = useLoader();
  start();
  return forward(operation).map((response) => {
    stop();
    return response;
  });
});
*/
// And update errorLink to call stop().

// Wait, if error happens, `map` might not be called if it throws before? 
// `onError` is separate.
// Let's modify errorLink to call stop() as well.

/**
 * Apollo Client configuration with authentication
 */
const apolloClient = new ApolloClient({
  link: from([errorLink, authLink, loaderLink, httpLink]), // loaderLink should be close to network?
  // If loaderLink is here: Request -> errorLink -> authLink -> loaderLink -> httpLink
  // Response <- errorLink <- authLink <- loaderLink <- httpLink
  // So loaderLink starts.
  // If httpLink fails, errorLink catches.
  // We need `loaderLink` to be aware?
  // Correct order: Error -> Auth -> Loader -> Http
  // Request: Error(pass) -> Auth(add header) -> Loader(start) -> Http(send)
  // Response: Error(check) <- Auth(pass) <- Loader(stop) <- Http(return)
  // Error: Error(catch, stop?) <- ...

  // Impl below:
  link: from([errorLink, authLink, loaderLink, httpLink]),
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'cache-and-network',
    },
  },
});

provideApolloClient(apolloClient);

export default apolloClient;

