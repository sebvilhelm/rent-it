/** @jsx jsx */
import { jsx, css } from '@emotion/core'
import { useEffect } from 'react'
import { useQuery } from 'react-apollo-hooks'
import graphql from 'graphql-tag'

const styles = {
  bookingList: css`
    display: grid;
    row-gap: 1rem;
  `,
}

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
    refetch,
  } = useQuery(QUERY_MY_BOOKINGS)

  useEffect(() => {
    refetch()
  }, [])

  return (
    <div>
      <h2>My bookings</h2>
      <div css={styles.bookingList}>
        {bookings.map(booking => {
          return (
            <div key={booking.id}>
              <Booking booking={booking} />
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default MyBookings
