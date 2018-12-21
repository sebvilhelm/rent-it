/** @jsx jsx */
import { jsx, css } from '@emotion/core'
import { Link } from '@reach/router'
import { useQuery } from 'react-apollo-hooks'
import gql from 'graphql-tag'

const QUERY_ITEMS_BY_CATEGORY = gql`
  query itemsByCategory($slug: String!, $searchTerm: String) {
    category(where: { slug: $slug }) {
      title
    }
    items(
      where: {
        AND: [{ category: { slug: $slug } }, { title_contains: $searchTerm }]
      }
    ) {
      id
      title
      averageRating
    }
    itemsConnection(
      where: {
        AND: [{ category: { slug: $slug } }, { title_contains: $searchTerm }]
      }
    ) {
      aggregate {
        count
      }
    }
  }
`

const styles = {
  grid: css`
    display: grid;
    gap: 1rem;
    grid-template-columns: repeat(3, 1fr);
  `,
}

function Category(props) {
  const { slug } = props

  // !: No URLSearchParams support on iOS Safari
  // !: polyfill found at https://github.com/ungap/url-search-params
  const params = new URLSearchParams(props.location.search)

  const variables = params.has('s')
    ? {
        slug,
        searchTerm: params.get('s'),
      }
    : {
        slug,
      }

  const {
    data: { items, category },
  } = useQuery(QUERY_ITEMS_BY_CATEGORY, {
    variables,
  })

  return (
    <div>
      <h1>{category.title}</h1>
      {items.length > 0 && (
        <div css={styles.grid}>
          {items.map(item => {
            return <ItemCard key={item.id} item={item} />
          })}
        </div>
      )}
    </div>
  )
}

const cardStyles = {
  card: css`
    padding: 1rem;
    background-color: tomato;
  `,
  title: css`
    margin-top: 0;
  `,
}

function ItemCard(props) {
  const { item } = props
  return (
    <div css={cardStyles.card}>
      <h3 css={cardStyles.title}>{item.title}</h3>
      {item.averageRating ? (
        <span>{item.averageRating.toFixed(1)}</span>
      ) : (
        <span>Not rated</span>
      )}
      <div>
        <Link to={`/item/${item.id}`}>Check it out here</Link>
      </div>
    </div>
  )
}

export default Category
