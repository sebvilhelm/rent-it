import React, { useEffect } from 'react'
import { useQuery, useMutation } from 'react-apollo-hooks'
import graphql from 'graphql-tag'
import Button from './elements/Button'
import confirm from '../lib/confirm'

const QUERY_MY_PENDING_BOOKINGS = graphql`
  query myPendingBookings {
    me {
      id
      pendingBookings {
        id
        item {
          title
        }
        booker {
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
      booker {
        name
      }
    }
  }
`

function Booking(props) {
  const { booking } = props

  const acceptBooking = useMutation(MUTATION_ACCEPT_BOOKING, {
    variables: { id: booking.id },
    refetchQueries: [{ query: QUERY_MY_PENDING_BOOKINGS }],
  })
  return (
    <div {...props}>
      <p>
        {booking.booker.name} wants to book your {booking.item.title}
      </p>
      <Button
        onClick={async () => {
          try {
            const confirmed = confirm(
              'Are you sure you want to accept this booking?'
            )
            if (confirmed) {
              acceptBooking()
            }
          } catch (error) {
            console.error(error.message)
          }
        }}
      >
        Accept
      </Button>
      <Button>Deny</Button>
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
    <div>
      <h2>Pending bookings</h2>
      {me.pendingBookings.map(booking => (
        <Booking key={booking.id} booking={booking} />
      ))}
    </div>
  )
}

export default PendingBookings
