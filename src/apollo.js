import { ApolloClient, InMemoryCache, createHttpLink, from } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { authStorage } from '../utils/authStorage.js';

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
 * Apollo Client configuration with authentication
 */
const apolloClient = new ApolloClient({
  link: from([authLink, httpLink]),
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'cache-and-network',
    },
  },
});

export default apolloClient;

