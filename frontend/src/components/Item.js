import React from 'react'
import { useQuery } from 'react-apollo-hooks'
import graphql from 'graphql-tag'
import formatPrice from '../lib/formatPrice'
import AddBooking from './AddBooking'

const ITEM_QUERY = graphql`
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
      <AddBooking id={props.id} />
    </div>
  )
}

export default Item
