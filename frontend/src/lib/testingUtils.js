import casual from 'casual'
import { ApolloClient } from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { MockLink } from 'apollo-link-mock'

casual.seed(123)

export const fakeUser = overrides => ({
  __typename: 'User',
  id: 'abc123',
  name: casual.full_name,
  email: casual.email,
  items: [],
  bookings: [],
  pendingBookings: [],
  ...overrides,
})

export const fakeItem = overrides => ({
  __typename: 'Item',
  id: 'xyz789',
  title: casual.title,
  description: casual.description,
  price: 50000,
  averageRating: null,
  image: {
    full: 'dog_full.jpg',
    preview: 'dog_preview.jpg',
  },
  reviews: [],
  category: [fakeCategory()],
  ...overrides,
})

export const fakeCategory = overrides => ({
  __typename: 'Category',
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
