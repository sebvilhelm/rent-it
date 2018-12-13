import React, { useState } from 'react'
import gql from 'graphql-tag'
import { Input, Label, Textarea, Form } from './elements/Form'

const MUTATION_ADD_ITEM = gql`
  mutation addItem(
    $title: String!
    $description: String!
    $price: Int!
    $maxDuration: Int
  ) {
    createItem(
      title: $title
      description: $description
      price: $price
      maxDuration: $maxDuration
    ) {
      id
    }
  }
`

function useInput(initialValue) {
  const [value, setValue] = useState(initialValue)

  const onChange = event => setValue(event.target.value)

  return [value, onChange, setValue]
}

function AddItem() {
  const [durationToggle, setDurationToggle] = useState(false)
  const [title, onChangeTitle] = useInput('')
  const [description, onChangeDescription] = useInput('')
  const [price, onChangePrice] = useInput(0)
  const [maxDuration, onChangeMaxDuration] = useInput(0)

  return (
    <div>
      <Form onSubmit={event => event.stopPropagation()}>
        <Label htmlFor="title">
          Title
          <Input
            value={title}
            onChange={onChangeTitle}
            type="text"
            name="title"
            id="title"
          />
        </Label>

        <Label htmlFor="description">
          Description
          <Textarea
            value={description}
            onChange={onChangeDescription}
            id="description"
          />
        </Label>
        <Label htmlFor="price">
          Price
          <Input
            value={price}
            onChange={onChangePrice}
            type="number"
            name="price"
            id="price"
          />
        </Label>
        <Label htmlFor="durationToggle">
          Max duration ?
          <Input
            checked={durationToggle}
            onChange={event => setDurationToggle(event.target.checked)}
            type="checkbox"
            name="durationToggle"
            id="durationToggle"
          />
        </Label>
        {durationToggle && (
          <Label htmlFor="maxDuration">
            Max Duration in days
            <Input
              value={maxDuration}
              onChange={onChangeMaxDuration}
              type="number"
              name="maxDuration"
              id="maxDuration"
            />
          </Label>
        )}
      </Form>
    </div>
  )
}

export default AddItem
