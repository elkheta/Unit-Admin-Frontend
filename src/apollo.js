import { ApolloClient, InMemoryCache, createHttpLink, from, ApolloLink, Observable } from '@apollo/client';
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
 * Loader Link - properly handles cancellation/abort
 */
const loaderLink = new ApolloLink((operation, forward) => {
  const { start, stop } = useLoader();
  start();

  return new Observable((observer) => {
    const subscription = forward(operation).subscribe({
      next: (result) => {
        observer.next(result);
      },
      error: (err) => {
        stop();
        observer.error(err);
      },
      complete: () => {
        stop();
        observer.complete();
      },
    });

    // Cleanup when request is cancelled/unsubscribed
    return () => {
      stop();
      subscription.unsubscribe();
    };
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
 * Note: Loader stop() is handled by loaderLink's cleanup, not here
 */
const errorLink = onError(({ graphQLErrors, networkError }) => {
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

/**
 * Apollo Client configuration with authentication
 * Link order: errorLink -> authLink -> loaderLink -> httpLink
 */
const apolloClient = new ApolloClient({
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

