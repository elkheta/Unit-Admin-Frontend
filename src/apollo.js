import { ApolloClient, InMemoryCache, createHttpLink, from } from '@apollo/client';
import { onError } from '@apollo/client/link/error';
import { setContext } from '@apollo/client/link/context';
import { provideApolloClient } from '@vue/apollo-composable';
import { authStorage } from '../utils/authStorage.js';
import router from '../router/index.js';

/**
 * HTTP Link for GraphQL endpoint
 */
const httpLink = createHttpLink({
  uri: import.meta.env.VITE_GRAPHQL_ENDPOINT || 'http://127.0.0.1:8000/graphql',
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
const errorLink = onError(({ graphQLErrors }) => {
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
 */
const apolloClient = new ApolloClient({
  link: from([errorLink, authLink, httpLink]),
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'cache-and-network',
    },
  },
});

provideApolloClient(apolloClient);

export default apolloClient;

