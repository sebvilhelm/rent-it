import React from 'react'
import { Link } from '@reach/router'
import gql from 'graphql-tag'
import { useQuery } from 'react-apollo-hooks'

const QUERY_CATEGORIES = gql`
  query categoriesPage {
    categories {
      slug
      name
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
          <Link to={`/category/${category.slug}`}>{category.name}</Link>
        </div>
      ))}
    </div>
  )
}

export default Categories
