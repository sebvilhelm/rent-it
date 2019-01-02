/** @jsx jsx */
import { jsx, css } from '@emotion/core'
import { Fragment, useState, Suspense } from 'react'
import gql from 'graphql-tag'
import { useMutation, useQuery } from 'react-apollo-hooks'
import Downshift from 'downshift'
import { Input, Label, Textarea, Form, Fieldset } from './elements/Form'
import Button from './elements/Button'
import useInput from '../lib/useInput'
import formatPrice from '../lib/formatPrice'
import Spinner from './Spinner'
import ErrorHandler from './ErrorHandler'
import Layout from './Layout'

const MUTATION_ADD_ITEM = gql`
  mutation addItem(
    $title: String!
    $description: String!
    $price: Int!
    $maxDuration: Int
    $category: ID!
    $imageFull: String!
    $imagePreview: String!
  ) {
    createItem(
      title: $title
      description: $description
      price: $price
      maxDuration: $maxDuration
      category: $category
      imageFull: $imageFull
      imagePreview: $imagePreview
    ) {
      id
    }
  }
`

const QUERY_SEARCH_CATEGORIES = gql`
  query searchCategories($searchTerm: String!) {
    categories(where: { title_contains: $searchTerm }) {
      id
      title
    }
  }
`

const styles = {
  dropdownList: css`
    margin: 0;
    list-style: none;
    background-color: #f5f5f5;
    color: #444444;
    border-top: 1px solid #eaeaea;
    padding: 0.5rem 0 1rem;
    border-radius: 0 0 6px 6px;
  `,
  item: css`
    padding: 0.5rem;
  `,
}

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
      itemToString={item => (item ? item.title : null)}
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
            <ul
              css={styles.dropdownList}
              style={{ marginTop: '-0.5rem' }}
              {...getMenuProps()}
            >
              {!inputValue ? (
                <div>Please enter a category</div>
              ) : (
                <Suspense fallback={<Spinner />}>
                  <CategoryList searchTerm={inputValue}>
                    {({ categories }) =>
                      categories.map((item, index) => (
                        <li
                          css={styles.item}
                          style={{
                            backgroundColor:
                              highlightedIndex === index
                                ? '#eaeaea'
                                : 'transparent',
                          }}
                          {...getItemProps({ item, index })}
                          key={item.id}
                        >
                          {item.title}
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

async function uploadImage(event) {
  console.log('Uploading image...')
  const {
    files: [file],
  } = event.target

  const data = new FormData()
  data.append('file', file)
  data.append('upload_preset', 'bachelor-project')

  const res = await fetch(
    'https://api.cloudinary.com/v1_1/vilhelmnielsen/image/upload',
    { method: 'POST', body: data }
  )

  console.log('Upload complete')

  return await res.json()
}

function AddItem() {
  const [durationToggle, setDurationToggle] = useState(false)
  const [title, onChangeTitle, setTitle] = useInput('')
  const [description, onChangeDescription, setDescription] = useInput('')
  const [price, onChangePrice, setPrice] = useInput(0)
  const [maxDuration, onChangeMaxDuration, setMaxDuration] = useInput(0)
  const [image, setImage] = useState(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState(null)
  const [category, setCategory] = useState({})

  const variables = {
    title,
    description,
    imageFull: image ? image.full : null,
    imagePreview: image ? image.preview : null,
    category: category.id || null,
    price: Number(price),
  }

  const addItem = useMutation(MUTATION_ADD_ITEM, {
    variables: durationToggle
      ? { ...variables, maxDuration: Number(maxDuration) }
      : variables,
  })
  return (
    <Layout>
      <section>
        <h1>Add item</h1>
        {error && <ErrorHandler error={error} />}
        <Form
          onSubmit={async event => {
            event.preventDefault()
            setBusy(true)
            try {
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

            <Label htmlFor="image">
              Image
              <Input
                type="file"
                id="image"
                name="image"
                required
                accept="image/jpeg"
                onChange={async event => {
                  const upload = await uploadImage(event)
                  const image = {
                    full: upload.secure_url,
                    preview: upload.eager[0].secure_url,
                  }
                  setImage(image)
                  console.log(image)
                }}
              />
            </Label>

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
            <p>{formatPrice(price)} per day</p>
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
      </section>
    </Layout>
  )
}

export default AddItem
