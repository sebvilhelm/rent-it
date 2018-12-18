import ApolloClient from 'apollo-boost'
import { endpoint } from '../config'

function createApolloClient() {
  return new ApolloClient({
    uri: endpoint,
    credentials: 'include',
  })
}

export default createApolloClient
