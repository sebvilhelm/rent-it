import React, { Fragment, useState, Suspense } from 'react'
import gql from 'graphql-tag'
import { useMutation, useQuery } from 'react-apollo-hooks'
import Downshift from 'downshift'
import { Input, Label, Textarea, Form, Fieldset } from './elements/Form'
import Button from './elements/Button'
import useInput from '../lib/useInput'
import Spinner from './Spinner'
import Error from './Error'

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

const QUERY_SEARCH_CATEGORIES = gql`
  query searchCategories($searchTerm: String!) {
    categories(where: { name_contains: $searchTerm }) {
      id
      name
    }
  }
`

function CategoryList({ searchTerm, children }) {
  const {
    data: { categories },
  } = useQuery(QUERY_SEARCH_CATEGORIES, { variables: { searchTerm } })

  return children({ categories })
}

function CategoryInput(props) {
  const { setCategory, ...inputProps } = props
  return (
    <Downshift
      itemToString={item => (item ? item.name : null)}
      onChange={(selectedCategory, downshift) => {
        setCategory(selectedCategory)
      }}
    >
      {({
        getInputProps,
        getLabelProps,
        getMenuProps,
        getItemProps,
        isOpen,
        inputValue,
        highlightedIndex,
      }) => (
        <div>
          <Label {...getLabelProps()}>
            Category
            <Input {...getInputProps({ ...inputProps })} />
          </Label>
          {isOpen && (
            <ul {...getMenuProps()}>
              {!inputValue ? (
                <div>Please enter a category</div>
              ) : (
                <Suspense fallback={<Spinner />}>
                  <CategoryList searchTerm={inputValue}>
                    {({ categories }) =>
                      categories.map((item, index) => (
                        <li
                          style={{
                            backgroundColor:
                              highlightedIndex === index
                                ? 'hotpink'
                                : 'transparent',
                          }}
                          {...getItemProps({ item, index })}
                          key={item.id}
                        >
                          {item.name}
                        </li>
                      ))
                    }
                  </CategoryList>
                </Suspense>
              )}
            </ul>
          )}
        </div>
      )}
    </Downshift>
  )
}

function AddItem() {
  const [durationToggle, setDurationToggle] = useState(false)
  const [title, onChangeTitle, setTitle] = useInput('')
  const [description, onChangeDescription, setDescription] = useInput('')
  const [price, onChangePrice, setPrice] = useInput(0)
  const [maxDuration, onChangeMaxDuration, setMaxDuration] = useInput(0)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState(null)
  const [category, setCategory] = useState({})

  const variables = {
    title,
    description,
    category: category.id || '',
    price: Number(price),
  }

  const addItem = useMutation(MUTATION_ADD_ITEM, {
    variables: durationToggle
      ? { ...variables, maxDuration: Number(maxDuration) }
      : variables,
  })
  return (
    <div>
      {error && <Error error={error} />}
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
            console.log(res)
          } catch (error) {
            setError(error)
          } finally {
            setBusy(false)
          }
        }}
      >
        <Fieldset disabled={busy}>
          <Label htmlFor="title">
            Title
            <Input
              required
              autoComplete="off"
              value={title}
              onChange={onChangeTitle}
              type="text"
              name="title"
              id="title"
            />
          </Label>

          <CategoryInput required setCategory={setCategory} />

          <Label htmlFor="description">
            Description
            <Textarea
              required
              autoComplete="off"
              value={description}
              onChange={onChangeDescription}
              id="description"
            />
          </Label>
          <Label htmlFor="price">
            Price
            <Input
              required
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
          <Button>
            Add Item
            {busy && (
              <Fragment>
                {' '}
                <Spinner />
              </Fragment>
            )}
          </Button>
        </Fieldset>
      </Form>
    </div>
  )
}

export default AddItem
