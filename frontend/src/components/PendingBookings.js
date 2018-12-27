/** @jsx jsx */
import { jsx, css } from '@emotion/core'
import { useEffect } from 'react'
import { useQuery, useMutation } from 'react-apollo-hooks'
import graphql from 'graphql-tag'
import Button from './elements/Button'
import confirm from '../lib/confirm'
import Layout from './Layout'

const QUERY_MY_PENDING_BOOKINGS = graphql`
  query myPendingBookings {
    me {
      id
      pendingBookings {
        id
        item {
          id
          title
        }
        booker {
          id
          name
        }
        status
      }
    }
  }
`

const MUTATION_ACCEPT_BOOKING = graphql`
  mutation acceptBooking($id: ID!) {
    acceptBooking(id: $id) {
      id
      booker {
        id
        name
      }
    }
  }
`
const MUTATION_DENY_BOOKING = graphql`
  mutation denyBooking($id: ID!) {
    denyBooking(id: $id) {
      id
      booker {
        id
        name
      }
    }
  }
`

const cardStyles = {
  card: css`
    background-color: white;
    box-shadow: 2px 2px 35px hsla(0, 0%, 0%, 0.05),
      2px 2px 20px hsla(0, 0%, 0%, 0.1);
    z-index: 1;
    transition: all 300ms;
    padding: 1rem;
  `,
}

function Booking(props) {
  const { booking } = props

  const acceptBooking = useMutation(MUTATION_ACCEPT_BOOKING, {
    variables: { id: booking.id },
    refetchQueries: [{ query: QUERY_MY_PENDING_BOOKINGS }],
  })
  const denyBooking = useMutation(MUTATION_DENY_BOOKING, {
    variables: { id: booking.id },
    refetchQueries: [{ query: QUERY_MY_PENDING_BOOKINGS }],
  })
  return (
    <div css={cardStyles.card} {...props}>
      <h2
        css={css`
          margin-bottom: 1rem;
        `}
      >
        {booking.booker.name} wants to book your {booking.item.title}
      </h2>
      <Button
        color="green"
        onClick={async () => {
          try {
            const confirmed = confirm(
              'Are you sure you want to accept this booking?'
            )
            if (confirmed) {
              await acceptBooking()
              console.log('Booking accepted!')
            }
          } catch (error) {
            console.error(error.message)
          }
        }}
      >
        Accept
      </Button>
      <span style={{ marginRight: '0.25rem' }} />
      <Button
        transparent
        color="red"
        onClick={async () => {
          try {
            const confirmed = confirm(
              'Are you sure you want to deny this booking?'
            )
            if (confirmed) {
              await denyBooking()
              console.log('Booking denied!')
            }
          } catch (error) {
            console.error(error.message)
          }
        }}
      >
        Deny
      </Button>
      <div
        css={css`
          margin-bottom: 0.5rem;
        `}
      />
    </div>
  )
}

function PendingBookings() {
  const {
    data: { me },
    refetch,
  } = useQuery(QUERY_MY_PENDING_BOOKINGS)

  useEffect(() => {
    refetch()
  }, [])

  return (
    <Layout>
      <section>
        <h1
          css={css`
            margin-bottom: 1rem;
          `}
        >
          Pending bookings
        </h1>
        {me.pendingBookings.map(booking => (
          <Booking key={booking.id} booking={booking} />
        ))}
      </section>
    </Layout>
  )
}

export default PendingBookings
