import React from 'react'
import { ApolloProvider } from 'react-apollo-hooks'
import { render, wait } from 'react-testing-library'
import { createClient, fakeCategory } from './lib/testingUtils'
import App from './App'
import { QUERY_CURRENT_USER } from './components/User'
import { QUERY_CATEGORIES } from './components/Categories'

const categoryMock = {
  request: { query: QUERY_CATEGORIES },
  result: { data: { categories: [fakeCategory()] } },
}

const unauthenticatedMock = [
  {
    request: {
      query: QUERY_CURRENT_USER,
    },
    result: {
      data: { me: null },
    },
  },
  categoryMock,
]

describe('<App />', () => {
  it('renders and matches snapshot', async () => {
    const client = createClient(unauthenticatedMock)
    const { container, debug } = render(
      <ApolloProvider client={client}>
        <App />
      </ApolloProvider>
    )
    await wait()
    expect(container).toMatchSnapshot()
    // TODO: Test incomplete
  })
})
