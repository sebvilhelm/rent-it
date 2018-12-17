import React from 'react'
import { useQuery } from 'react-apollo-hooks'
import graphql from 'graphql-tag'

const QUERY_MY_BOOKINGS = graphql`
  query myBookings {
    me {
      id
      name
      bookings {
        id
        status
        startDate
        endDate
        item {
          title
        }
      }
    }
  }
`

function Booking({ booking, ...props }) {
  const { item, status } = booking
  return (
    <div {...props}>
      <h3>{item.title}</h3>
      <dl>
        <dt>Status</dt>
        <dd>{status}</dd>
      </dl>
    </div>
  )
}

function MyBookings() {
  const {
    data: {
      me: { bookings },
    },
  } = useQuery(QUERY_MY_BOOKINGS)

  console.log(bookings)
  return (
    <div>
      <h2>My bookings</h2>
      {/* <ul>
        {bookings.map(booking => {
          return (
            <li key={booking.id}>
              <Booking booking={booking} />
            </li>
          )
        })}
      </ul> */}
    </div>
  )
}

export default MyBookings
