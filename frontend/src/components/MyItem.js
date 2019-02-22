/** @jsx jsx */
import { jsx, css } from '@emotion/core'
import { Fragment, useState, useEffect } from 'react'
import { useQuery, useMutation } from 'react-apollo-hooks'
import gql from 'graphql-tag'
import {
  differenceInCalendarDays,
  format,
  distanceInWordsToNow,
  startOfToday,
} from 'date-fns'
import Button from './elements/Button'
import confirm from '../lib/confirm'
import formatPrice from '../lib/formatPrice'

function MyItem({ id }) {
  const {
    data: { item },
    refetch,
  } = useQuery(QUERY_MY_ITEM, {
    suspend: true,
    variables: { id, now: startOfToday() },
  })

  useEffect(() => {
    refetch()
  }, [])

  return (
    <section>
      <h1
        css={css`
          margin-bottom: 1rem;
        `}
      >
        {item.title}
      </h1>
      {item.pendingBookings.length > 0 && (
        <Fragment>
          <h2
            css={css`
              margin-bottom: 1rem;
            `}
          >
            Pending bookings
          </h2>
          <div css={styles.grid}>
            {item.pendingBookings.map(booking => (
              <PendingBooking booking={booking} key={booking.id} />
            ))}
          </div>
          <div
            css={css`
              margin-bottom: 3rem;
            `}
          />
        </Fragment>
      )}
      {item.upcomingBookings.length > 0 && (
        <Fragment>
          <h2
            css={css`
              margin-bottom: 1rem;
            `}
          >
            Upcoming bookings
          </h2>
          <div css={styles.grid}>
            {item.upcomingBookings.map(booking => (
              <UpcomingBooking booking={booking} key={booking.id} />
            ))}
          </div>
          <div
            css={css`
              margin-bottom: 3rem;
            `}
          />
        </Fragment>
      )}
      {item.notPendingBookings.length > 0 && (
        <Fragment>
          <h2
            css={css`
              margin-bottom: 1rem;
            `}
          >
            Bookings
          </h2>
          <div css={styles.grid}>
            {item.notPendingBookings.map(booking => (
              <Booking booking={booking} key={booking.id} />
            ))}
          </div>
        </Fragment>
      )}
    </section>
  )
}

const FRAGMENT_MY_ITEM = gql`
  fragment myItemBooking on Booking {
    id
    status
    item {
      id
      title
    }
    startDate
    endDate
    payment {
      price
    }
    booker {
      id
      name
    }
  }
`

const QUERY_MY_ITEM = gql`
  query myItem($id: ID!, $now: DateTime!) {
    item(where: { id: $id }) {
      id
      title
      pendingBookings: bookings(where: { status: PENDING }) {
        ...myItemBooking
      }
      notPendingBookings: bookings(where: { NOT: { status: PENDING } }) {
        ...myItemBooking
      }
      upcomingBookings: bookings(
        where: { AND: [{ status: APPROVED }, { startDate_gt: $now }] }
      ) {
        ...myItemBooking
      }
    }
  }
  ${FRAGMENT_MY_ITEM}
`

const styles = {
  grid: css`
    display: grid;
    gap: 1rem;
    grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  `,
}

export function PendingBooking(props) {
  const { booking } = props

  const variables = { id: booking.item.id, now: startOfToday() }

  const acceptBooking = useMutation(MUTATION_ACCEPT_BOOKING, {
    variables: { id: booking.id },
    refetchQueries: [{ query: QUERY_MY_ITEM, variables }],
  })
  const denyBooking = useMutation(MUTATION_DENY_BOOKING, {
    variables: { id: booking.id },
    refetchQueries: [{ query: QUERY_MY_ITEM, variables }],
  })

  const duration = differenceInCalendarDays(booking.endDate, booking.startDate)

  return (
    <div css={cardStyles.card} {...props}>
      <h3
        css={css`
          margin-bottom: 1rem;
        `}
      >
        Pending booking
      </h3>
      <p
        css={css`
          margin-bottom: 1rem;
        `}
      >
        {booking.booker.name} wants to book your {booking.item.title} for{' '}
        {duration} days.
      </p>
      <p
        css={css`
          margin-bottom: 1rem;
        `}
      >
        {format(booking.startDate, 'DD/MM/YY')} –{' '}
        {format(booking.endDate, 'DD/MM/YY')}
      </p>
      <p>For {formatPrice(booking.payment.price)}</p>
      <div
        css={css`
          margin-bottom: 1rem;
        `}
      />
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

const MUTATION_ACCEPT_BOOKING = gql`
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
const MUTATION_DENY_BOOKING = gql`
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

const Pill = props => (
  <div
    css={css`
      --color: #22a3bb;
      --text-color: #edffff;
      background-color: var(--color);
      color: var(--text-color);
      display: inline-flex;
      border-radius: 1rem;
      padding: 0 1rem;
    `}
    {...props}
  />
)

function Status({ status, ...props }) {
  switch (status) {
    case 'APPROVED':
      return (
        <Pill
          css={css`
            --color: #3d9951;
            --text-color: #fcfff5;
          `}
          {...props}
        >
          Approved
        </Pill>
      )
    case 'DENIED':
      return (
        <Pill
          css={css`
            --color: #993d3d;
            --text-color: #fff5f9;
          `}
          {...props}
        >
          Denied
        </Pill>
      )
    case 'CANCELLED':
      return (
        <Pill
          css={css`
            --color: #993d3d;
            --text-color: #fff5f9;
          `}
          {...props}
        >
          Cancelled
        </Pill>
      )
    default:
      return <Pill {...props}>{status.toLowerCase()}</Pill>
  }
}

function Booking(props) {
  const { booking } = props
  return (
    <div css={cardStyles.card}>
      <h3
        css={css`
          margin-bottom: 1rem;
        `}
      >
        {booking.booker.name}
      </h3>
      <Status status={booking.status} />
      <div
        css={css`
          margin-bottom: 1rem;
        `}
      />
      <p
        css={css`
          margin-bottom: 1rem;
        `}
      >
        {format(booking.startDate, 'DD/MM/YY')} –{' '}
        {format(booking.endDate, 'DD/MM/YY')}
      </p>
      <p>For {formatPrice(booking.payment.price)}</p>
    </div>
  )
}

const MUTATION_CANCEL_BOOKING = gql`
  mutation cancelBooking($id: ID!) {
    cancelBooking(id: $id) {
      id
    }
  }
`

function UpcomingBooking(props) {
  const { booking } = props
  const cancelBooking = useMutation(MUTATION_CANCEL_BOOKING, {
    variables: { id: booking.id },
    refetchQueries: [
      {
        query: QUERY_MY_ITEM,
        variables: { id: booking.item.id, now: startOfToday() },
      },
    ],
  })
  const [error, setError] = useState(null)
  return (
    <div css={cardStyles.card}>
      <p
        css={css`
          margin-bottom: 1rem;
        `}
      >
        {booking.booker.name} is booking your {booking.item.title} in{' '}
        {distanceInWordsToNow(booking.startDate)}
      </p>
      <div
        css={css`
          margin-bottom: 1rem;
        `}
      />
      <p
        css={css`
          margin-bottom: 1rem;
        `}
      >
        {format(booking.startDate, 'DD/MM/YY')} –{' '}
        {format(booking.endDate, 'DD/MM/YY')}
      </p>
      <p>For {formatPrice(booking.payment.price)}</p>
      <Button
        color="red"
        onClick={async () => {
          setError(null)
          try {
            await cancelBooking()
          } catch (error) {
            console.error(error)
            setError(error)
          }
        }}
      >
        Cancel
      </Button>
    </div>
  )
}

export default MyItem
export { FRAGMENT_MY_ITEM }
