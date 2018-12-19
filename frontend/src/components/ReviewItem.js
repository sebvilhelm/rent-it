import React, { useState } from 'react'
import { useMutation } from 'react-apollo-hooks'
import graphql from 'graphql-tag'
import { Form, Input, Textarea, Label, Fieldset } from './elements/Form'
import Button from './elements/Button'
import useInput from '../lib/useInput'

const MUTATION_REVIEW_ITEM = graphql`
  mutation reviewItem($id: ID!, $rating: Int!, $description: String) {
    reviewItem(id: $id, rating: $rating, description: $description) {
      id
    }
  }
`

function AddReview(props) {
  const [rating, onChangeRating] = useInput(5)
  const [description, onChangeDescription] = useInput('')
  const reviewItem = useMutation(MUTATION_REVIEW_ITEM, {
    variables: {
      id: props.id,
      rating: Number(rating),
      description: description || null,
    },
  })
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState(null)
  return (
    <Form
      onSubmit={async event => {
        event.preventDefault()
        setBusy(true)
        setError(null)
        try {
          await reviewItem()
        } catch (error) {
          setError(error)
        } finally {
          setBusy(false)
        }
      }}
    >
      <Fieldset disabled={busy}>
        <Label htmlFor="rating">
          Rating from 1 to 5
          <Input
            id="rating"
            name="rating"
            type="number"
            min="1"
            max="5"
            required
            value={rating}
            onChange={onChangeRating}
          />
        </Label>
        <Label htmlFor="description">
          Description
          <Textarea
            id="description"
            name="description"
            value={description}
            onChange={onChangeDescription}
          />
        </Label>
        <Button>Submit{busy && 'ting'} rating</Button>
      </Fieldset>
    </Form>
  )
}

function ReviewItem(props) {
  return <AddReview id={props.id} />
}

export default ReviewItem
