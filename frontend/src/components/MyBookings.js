/** @jsx jsx */
import { jsx, css } from '@emotion/core'
import { useEffect } from 'react'
import { useQuery } from 'react-apollo-hooks'
import graphql from 'graphql-tag'
import { differenceInCalendarDays, format } from 'date-fns'
import ReviewItem from './ReviewItem'
import Layout from './Layout'

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
          id
          title
        }
      }
    }
  }
`

function Booking({ booking, ...props }) {
  const { item, status, startDate, endDate } = booking
  return (
    <div {...props}>
      <h3>{item.title}</h3>
      <dl>
        <dt>Status</dt>
        <dd>{status}</dd>
        <dt>Duration</dt>
        <dd>
          <p>{differenceInCalendarDays(endDate, startDate)} days</p>
          <p>
            <time>{format(startDate, 'DD/MM/YYYY')}</time> –{' '}
            <time>{format(endDate, 'DD/MM/YYYY')}</time>
          </p>
        </dd>
      </dl>
      <ReviewItem id={item.id} />
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
    <Layout>
      <section>
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
      </section>
    </Layout>
  )
}

export default MyBookings
