/** @jsx jsx */
import { jsx, css } from '@emotion/core'
import { Link } from '@reach/router'
import gql from 'graphql-tag'
import { useQuery } from 'react-apollo-hooks'

import Layout from './Layout'

const QUERY_CATEGORIES = gql`
  query categoriesPage {
    categories {
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

function Categories() {
  const {
    data: { categories },
  } = useQuery(QUERY_CATEGORIES)
  return (
    <Layout>
      <section>
        <h1>Categories</h1>
        {categories.map(category => (
          <CategoryCard category={category} key={category.slug} />
        ))}
      </section>
    </Layout>
  )
}

export default Categories
export { QUERY_CATEGORIES }
