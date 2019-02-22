/** @jsx jsx */
import { useEffect } from 'react'
import { jsx, css } from '@emotion/core'
import { Link } from '@reach/router'
import gql from 'graphql-tag'
import { useQuery } from 'react-apollo-hooks'
import { siteMeta } from '../config'

import Layout from './Layout'

function Categories() {
  const {
    data: { categories },
    refetch,
  } = useQuery(QUERY_CATEGORIES, { suspend: true })

  useEffect(() => {
    document.title = 'Categories'
    return () => (document.title = siteMeta.title)
  }, [])

  useEffect(() => {
    refetch()
  }, [])

  return (
    <Layout>
      <section>
        <h1>Categories</h1>
        {categories &&
          categories.map(category => (
            <CategoryCard category={category} key={category.slug} />
          ))}
      </section>
    </Layout>
  )
}

const QUERY_CATEGORIES = gql`
  query categoriesPage {
    categories {
      id
      slug
      title
    }
  }
`

const cardStyles = {
  card: css`
    padding: 1rem;
  `,
}

function CategoryCard(props) {
  const { category } = props
  return (
    <div css={cardStyles.card}>
      <Link to={`/category/${category.slug}`}>{category.title}</Link>
    </div>
  )
}

export default Categories
export { QUERY_CATEGORIES }
