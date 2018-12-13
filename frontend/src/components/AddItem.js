import React, { useState } from 'react'
import gql from 'graphql-tag'
import { Input, Label, Textarea, Form } from './elements/Form'
import Button from './elements/Button'
import { useMutation } from 'react-apollo-hooks'

const MUTATION_ADD_ITEM = gql`
  mutation addItem(
    $title: String!
    $description: String!
    $price: Int!
    $maxDuration: Int
    $category: ID!
  ) {
    createItem(
      title: $title
      description: $description
      price: $price
      maxDuration: $maxDuration
      category: $category
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
  const [title, onChangeTitle, setTitle] = useInput('')
  const [description, onChangeDescription, setDescription] = useInput('')
  const [price, onChangePrice, setPrice] = useInput(0)
  const [maxDuration, onChangeMaxDuration, setMaxDuration] = useInput(0)
  const [busy, setBusy] = useState(false)
  // TODO: Make category dynamic
  const category = 'cjpi9rl3au3tq0a57j68jfr8q'
  const variables = { title, description, category, price: Number(price) }

  const addItem = useMutation(MUTATION_ADD_ITEM, {
    variables: durationToggle
      ? { ...variables, maxDuration: Number(maxDuration) }
      : variables,
  })
  return (
    <div>
      <Form
        onSubmit={async event => {
          event.preventDefault()
          try {
            setBusy(true)
            const res = await addItem()
            setTitle('')
            setDescription('')
            setPrice(0)
            setMaxDuration(0)
            // TODO: Success!
          } catch (error) {
            // TODO: Handle errors
            console.error(error.message)
          } finally {
            setBusy(false)
          }
        }}
      >
        <Label htmlFor="title">
          Title
          <Input
            autoComplete="off"
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
            autoComplete="off"
            value={description}
            onChange={onChangeDescription}
            id="description"
          />
        </Label>
        <Label htmlFor="price">
          Price
          <Input
            autoComplete="off"
            value={price}
            onChange={onChangePrice}
            type="number"
            name="price"
            id="price"
          />
        </Label>
        <Label htmlFor="durationToggle">
          Max duration?
          <Input
            autoComplete="off"
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
              autoComplete="off"
              value={maxDuration}
              onChange={onChangeMaxDuration}
              type="number"
              name="maxDuration"
              id="maxDuration"
            />
          </Label>
        )}
        <Button disabled={busy}>Add Item</Button>
      </Form>
    </div>
  )
}

export default AddItem
