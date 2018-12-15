import React, { useState } from 'react'
import { useMutation } from 'react-apollo-hooks'
import graphql from 'graphql-tag'
import Error from './Error'
import Button from './elements/Button'
import { Form } from './elements/Form'

const MUTATION_BOOK_ITEM = graphql`
  mutation bookItem($id: ID!, $startDate: DateTime!, $endDate: DateTime!) {
    book(itemId: $id, startDate: $startDate, endDate: $endDate) {
      id
    }
  }
`

// TODO: Add calendar for start date
// TODO: Add calendar for end date
function AddBooking(props) {
  const [startDate] = useState(new Date('2018-12-14'))
  const [endDate] = useState(new Date('2018-12-24'))
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState(null)

  const bookItem = useMutation(MUTATION_BOOK_ITEM, {
    variables: {
      id: props.id,
      startDate,
      endDate,
    },
  })

  return (
    <div>
      {error && <Error error={error} />}
      <Form
        onSubmit={async event => {
          event.preventDefault()
          try {
            setBusy(true)
            await bookItem()
          } catch (error) {
            setError(error)
          } finally {
            setBusy(false)
          }
        }}
      >
        <fieldset disabled={busy}>
          <Button>Book it!</Button>
        </fieldset>
      </Form>
    </div>
  )
}

export default AddBooking
