import React, { ConcurrentMode } from 'react'
import ReactDOM from 'react-dom'
import { ApolloProvider } from 'react-apollo'
import { ApolloProvider as ApolloHooksProvider } from 'react-apollo-hooks'
import './index.css'
import App from './App'
import createApolloClient from './lib/createApolloClient'

const client = createApolloClient()

function Wrapper() {
  return (
    <ApolloProvider client={client}>
      <ApolloHooksProvider client={client}>
        <ConcurrentMode>
          <App />
        </ConcurrentMode>
      </ApolloHooksProvider>
    </ApolloProvider>
  )
}

ReactDOM.render(<Wrapper />, document.getElementById('root'))
