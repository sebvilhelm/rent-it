import ApolloClient from 'apollo-boost'
import { endpoint } from '../config'

function createApolloClient() {
  return new ApolloClient({
    uri:
      process.env.NODE_ENV === 'development'
        ? endpoint
        : process.env.REACT_APP_GRAPHQL_ENDPOINT,
    credentials: 'include',
  })
}

export default createApolloClient
