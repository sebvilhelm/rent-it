import ApolloClient from 'apollo-boost'

function createApolloClient() {
  return new ApolloClient({
    uri: process.env.REACT_APP_GRAPHQL_ENDPOINT,
    credentials: 'include',
  })
}

export default createApolloClient
