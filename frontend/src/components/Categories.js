import React from 'react'
import { Link } from '@reach/router'
import gql from 'graphql-tag'
import { useQuery } from 'react-apollo-hooks'

const QUERY_CATEGORIES = gql`
  query categoriesPage {
    categories {
      slug
      title
    }
  }
`

function Categories() {
  const {
    data: { categories },
  } = useQuery(QUERY_CATEGORIES)
  return (
    <div>
      {categories.map(category => (
        <div key={category.slug}>
          <Link to={`/category/${category.slug}`}>{category.title}</Link>
        </div>
      ))}
    </div>
  )
}

export default Categories
