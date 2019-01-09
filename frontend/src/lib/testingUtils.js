import casual from 'casual'
import { ApolloClient } from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { MockLink } from 'apollo-link-mock'

casual.seed(666)

export const fakeUser = overrides => ({
  id: 'abc123',
  name: casual.full_name,
  email: casual.email,
  items: [],
  bookings: [],
  pendingBookings: [],
  ...overrides,
})

export const fakeCategory = overrides => ({
  id: 'cat345',
  title: casual.title,
  slug: casual.word,
  description: casual.description,
  items: [],
  ...overrides,
})

export function createClient(mocks) {
  return new ApolloClient({
    cache: new InMemoryCache(),
    link: new MockLink(mocks),
  })
}
