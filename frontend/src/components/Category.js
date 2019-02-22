/** @jsx jsx */
import { useEffect } from 'react'
import { jsx, css } from '@emotion/core'
import { useQuery } from 'react-apollo-hooks'
import gql from 'graphql-tag'
import { useMedia } from 'the-platform'
import { siteMeta } from '../config'

import ItemCard from './ItemCard'
import Layout from './Layout'

function Category(props) {
  const { slug } = props
  // !: No URLSearchParams support on iOS Safari
  // !: polyfill found at https://github.com/ungap/url-search-params
  const params = new URLSearchParams(props.location.search)
  const searchTerm = params.has('s') ? params.get('s') : null

  const variables = searchTerm
    ? {
        slug,
        searchTerm,
      }
    : {
        slug,
      }

  const {
    data: { items, category },
    refetch,
  } = useQuery(QUERY_ITEMS_BY_CATEGORY, {
    suspend: true,
    variables,
  })

  useEffect(() => {
    refetch()
  }, [])

  useEffect(
    () => {
      const documentTitle = searchTerm
        ? `“${searchTerm}” in ${category.title}`
        : category.title
      document.title = documentTitle

      return () => (document.title = siteMeta.title)
    },
    [category, searchTerm]
  )

  const large = useMedia({ minWidth: 400 })
  return (
    <Layout>
      <section>
        <h1
          css={css`
            margin-bottom: 1rem”;
          `}
        >
          {category.title}
          {searchTerm && ` matching “${searchTerm}”`}
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

export default Category
export { QUERY_ITEMS_BY_CATEGORY }
