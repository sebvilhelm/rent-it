/** @jsx jsx */
import { jsx, css } from '@emotion/core'
import { useQuery } from 'react-apollo-hooks'
import gql from 'graphql-tag'
import { useMedia } from 'the-platform'

import ItemCard from './ItemCard'
import Layout from './Layout'

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
      maxDuration
      price
      image {
        full
        preview
      }
      owner {
        id
      }
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
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  `,
}

function Category(props) {
  const { slug } = props

  const large = useMedia({ minWidth: 400 })

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
    <Layout>
      <section>
        <h1
          css={css`
            margin-bottom: 1rem;
          `}
        >
          {category.title}
        </h1>
        {items.length > 0 && (
          <div css={[large && styles.grid]}>
            {items.map(item => {
              return <ItemCard key={item.id} item={item} />
            })}
          </div>
        )}
      </section>
    </Layout>
  )
}

export default Category
export { QUERY_ITEMS_BY_CATEGORY }
