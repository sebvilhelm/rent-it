/** @jsx jsx */
import { jsx, css } from '@emotion/core'
import { Suspense, useState } from 'react'
import { useQuery } from 'react-apollo-hooks'
import gql from 'graphql-tag'
import { Link } from '@reach/router'
import useInput from '../lib/useInput'
import useFocus from '../lib/useFocus'
import SpacerGif from './SpacerGif'

function SearchBar(props) {
  const [value, onChange, setValue] = useInput('')
  const [hasFocus, onFocus, onBlur] = useFocus()
  return (
    <div
      css={css`
        position: relative;
      `}
      onFocus={onFocus}
      onBlur={onBlur}
      {...props}
    >
      <div
        css={css`
          position: relative;
        `}
      >
        <input
          value={value}
          onChange={onChange}
          css={[styles.input, hasFocus && value && styles.focussedInput]}
          placeholder="Search..."
          aria-label="search"
          type="text"
        />
        {value && (
          <button css={styles.clearButton} onClick={() => setValue('')}>
            &times;
          </button>
        )}
      </div>
      {value && hasFocus && (
        <div css={styles.dropdown}>
          <Suspense
            fallback={
              <p css={styles.dropdownItem}>Getting search results...</p>
            }
          >
            <SearchResults searchTerm={value} />
          </Suspense>
        </div>
      )}
    </div>
  )
}

const styles = {
  input: css`
    border: 0;
    background: #f5f5f5;
    padding: 0.5rem 1rem;
    width: 100%;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto',
      'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans',
      'Helvetica Neue', sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    &::placeholder {
      color: #7d7f80;
    }
    outline: 0;
  `,
  focussedInput: css``,
  clearButton: css`
    position: absolute;
    right: 0;
    height: 100%;
    border: none;
    background-color: transparent;
    padding: 0.5rem;
  `,
  dropdown: css`
    position: absolute;
    background-color: #f5f5f5;
    width: 100%;
    z-index: 9;
  `,
  count: css`
    font-weight: 100;
    font-feature-settings: 'tnum';
    font-variant-numeric: tabular-nums;
    display: flex;
    place-content: center;
  `,
  dropdownItem: css`
    color: black;
    text-decoration: none;
    font-size: 0.9rem;
    display: flex;
    padding: 0.5rem 1rem;
    font-size: 0.7rem;
  `,
  highlighted: css`
    background-color: #a5a5a5;
  `,
}

function SearchResults({ searchTerm, ...rest }) {
  const {
    data: { searchItems },
  } = useQuery(SEARCH_QUERY, { variables: { searchTerm } })

  const [focusIndex, setFocusIndex] = useState(null)

  if (!searchItems || !searchItems.length)
    return <p css={styles.dropdownItem}>No search results</p>

  return searchItems.map(({ category, count }, index) => {
    const highlighted = focusIndex === index
    return (
      <Link
        css={styles.dropdownItem}
        style={{
          backgroundColor: highlighted ? '#a5a5a5' : null,
        }}
        key={category.id}
        to={`/category/${category.slug}/?s=${searchTerm}`}
        onMouseOver={() => {
          setFocusIndex(index)
        }}
        onMouseOut={() => setFocusIndex(null)}
      >
        {category.title}
        <SpacerGif />
        <span css={styles.count} aria-label="items in this category">
          {count}
        </span>
      </Link>
    )
  })
}

const SEARCH_QUERY = gql`
  query search($searchTerm: String!) {
    searchItems(searchTerm: $searchTerm) {
      count
      category {
        slug
        id
        title
      }
    }
  }
`

export default SearchBar
export { SEARCH_QUERY }
