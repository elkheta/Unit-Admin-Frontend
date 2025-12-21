import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';

/**
 * Apollo Client configuration
 * For now, using a placeholder endpoint
 * Replace with actual GraphQL endpoint when backend is ready
 */
const httpLink = createHttpLink({
  uri: import.meta.env.VITE_GRAPHQL_ENDPOINT || 'http://localhost:4000/graphql',
});

const apolloClient = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'cache-and-network',
    },
  },
});

export default apolloClient;

