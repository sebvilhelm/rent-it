import React from 'react'
import { Link } from '@reach/router'
import { useQuery } from 'react-apollo-hooks'
import gql from 'graphql-tag'

const QUERY_ITEMS_BY_CATEGORY = gql`
  query itemsByCategory(
    $slug: String!
    $perPage: Int!
    $skip: Int!
    $searchTerm: String
  ) {
    items(
      first: $perPage
      skip: $skip
      where: {
        AND: [{ category: { slug: $slug } }, { title_contains: $searchTerm }]
      }
    ) {
      id
      title
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

function Category(props) {
  const { slug } = props

  // !: No URLSearchParams support on iOS Safari
  // !: polyfill found at https://github.com/ungap/url-search-params
  const params = new URLSearchParams(props.location.search)

  const variables = params.has('s')
    ? {
        slug,
        searchTerm: params.get('s'),
        perPage: 10,
        skip: 0,
      }
    : {
        slug,
        perPage: 10,
        skip: 0,
      }

  const {
    data: { items },
  } = useQuery(QUERY_ITEMS_BY_CATEGORY, {
    variables,
  })

  return (
    <div>
      {items.map(item => {
        return (
          <div key={item.id}>
            {item.title}
            <Link to={`/item/${item.id}`}>Check it out here</Link>
          </div>
        )
      })}
    </div>
  )
}

export default Category
