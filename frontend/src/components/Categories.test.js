import React, { Suspense } from 'react'
import { ApolloProvider } from 'react-apollo-hooks'
import { render, wait } from 'react-testing-library'
import { createClient, fakeCategory } from '../lib/testingUtils'
import Categories, { QUERY_CATEGORIES } from './Categories'

const category = fakeCategory()

const mocks = [
  {
    request: {
      query: QUERY_CATEGORIES,
    },
    result: {
      data: { categories: [category] },
    },
  },
]

describe('<Categories />', () => {
  fit('renders and matches snapshot', async () => {
    const client = createClient(mocks)
    const { getByText, container } = render(
      <ApolloProvider client={client}>
        <Suspense fallback="loading">
          <Categories />
        </Suspense>
      </ApolloProvider>
    )
    expect(getByText('loading')).toBeInTheDocument()
    await wait()
    expect(getByText(/Categories/i)).toBeInTheDocument()
    const link = container.querySelector('a')
    expect(link).toBeInTheDocument()
    expect(link.textContent).toBe(category.title)
    expect(link).toHaveAttribute('href', `/category/${category.slug}`)
    expect(container).toMatchSnapshot()
  })
})
