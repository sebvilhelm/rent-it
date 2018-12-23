import React, { ConcurrentMode } from 'react'
import ReactDOM from 'react-dom'
import { ApolloProvider as ApolloHooksProvider } from 'react-apollo-hooks'

import App from './App'
import createApolloClient from './lib/createApolloClient'

const client = createApolloClient()

function Wrapper() {
  return (
    <ApolloHooksProvider client={client}>
      <ConcurrentMode>
        <App />
      </ConcurrentMode>
    </ApolloHooksProvider>
  )
}

ReactDOM.render(<Wrapper />, document.getElementById('root'))
