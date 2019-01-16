import React, { Suspense } from 'react'
import { ApolloProvider } from 'react-apollo-hooks'
import { render, wait } from 'react-testing-library'
import { createClient, fakeItem } from '../lib/testingUtils'
import Item, { ITEM_QUERY } from './Item'

const item = fakeItem()

const mocks = [
  {
    request: {
      query: ITEM_QUERY,
      variables: { id: item.id },
    },
    result: {
      data: {
        item: {
          __typename: 'Item',
          id: item.id,
          title: 'poop',
          description: 'cool pop',
          reviews: [],
        },
      },
    },
  },
]

const waitForNextTick = () => new Promise(resolve => setTimeout(resolve))

describe('<Item />', () => {
  it.skip('renders and matches snapshot', async () => {
    const client = createClient(mocks)
    const { debug } = render(
      <Suspense fallback="loading">
        <ApolloProvider client={client}>
          <Item id={item.id} />
        </ApolloProvider>
      </Suspense>
    )
    render(null)
    await waitForNextTick()
    debug()
  })
})
