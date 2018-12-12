import React from 'react'
import { useQuery } from 'react-apollo-hooks'
import gql from 'graphql-tag'
import formatPrice from '../lib/formatPrice'

const ITEM_QUERY = gql`
  query item($id: ID!) {
    item(where: { id: $id }) {
      title
      description
      price
    }
  }
`

function Item(props) {
  const {
    data: { item },
  } = useQuery(ITEM_QUERY, { variables: { id: props.id } })
  return (
    <div>
      <h2>{item.title}</h2>
      <p>{item.description}</p>
      <p>Price: {formatPrice(item.price)}</p>
    </div>
  )
}

export default Item
