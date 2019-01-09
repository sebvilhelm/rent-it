import casual from 'casual'

casual.seed(666)

export const fakeUser = overrides => ({
  id: 'abc123',
  name: casual.name,
  email: casual.email,
  items: [],
  bookings: [],
  pendingBookings: [],
  ...overrides,
})
