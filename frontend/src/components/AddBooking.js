/** @jsx jsx */
import { jsx, css } from '@emotion/core'
import { useState } from 'react'
import { useMutation } from 'react-apollo-hooks'
import graphql from 'graphql-tag'
import useInput from '../lib/useInput'
import Error from './Error'
import Button from './elements/Button'
import { Form, Label, Input, Fieldset } from './elements/Form'

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
  const [startDate, onChangeStartDate] = useInput('')
  const [endDate, onChangeEndDate] = useInput('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState(null)

  const bookItem = useMutation(MUTATION_BOOK_ITEM, {
    variables: {
      id: props.id,
      startDate,
      endDate,
    },
  })

  const styles = {
    container: css`
      padding: 1rem;
      border: 1px solid hsl(0, 0%, 80%);
    `,
    title: css``,
  }

  return (
    <div css={styles.container} {...props}>
      <h3 css={styles.title}>Book this!</h3>
      {error && <Error error={error} />}
      <Form
        onSubmit={async event => {
          event.preventDefault()
          setBusy(true)
          setError(null)
          try {
            await bookItem()
          } catch (error) {
            setError(error)
          } finally {
            setBusy(false)
          }
        }}
      >
        <Fieldset disabled={busy}>
          <Label htmlFor="startDate">
            Start Date
            <Input
              required
              type="date"
              id="startDate"
              name="startDate"
              value={startDate}
              onChange={onChangeStartDate}
            />
          </Label>
          <Label htmlFor="endDate">
            End Date
            <Input
              required
              type="date"
              id="endDate"
              name="endDate"
              value={endDate}
              onChange={onChangeEndDate}
            />
          </Label>
          <Button>Book{busy && 'ing'} it!</Button>
        </Fieldset>
      </Form>
    </div>
  )
}

export default AddBooking
