/** @jsx jsx */
import { jsx, css } from '@emotion/core'
import { useEffect } from 'react'
import { useQuery } from 'react-apollo-hooks'
import graphql from 'graphql-tag'
import BookingCard from './BookingCard'
import Layout from './Layout'

const styles = {
  bookingList: css`
    display: grid;
    gap: 2rem 1rem;
    grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
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
        payment {
          price
        }
        item {
          id
          title
          image {
            full
            preview
          }
        }
      }
    }
  }
`

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
    <Layout>
      <section>
        <h1>My bookings</h1>
        <div css={styles.bookingList}>
          {bookings.map(booking => {
            return <BookingCard key={booking.id} booking={booking} />
          })}
        </div>
      </section>
    </Layout>
  )
}

export default MyBookings
