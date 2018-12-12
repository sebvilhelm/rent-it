import React from 'react'
import { useQuery } from 'react-apollo-hooks'
import gql from 'graphql-tag'

const ITEM_QUERY = gql`
  query item($id: ID!) {
    item(where: { id: $id }) {
      title
    }
  }
`

function Item(props) {
  const {
    data: { item },
  } = useQuery(ITEM_QUERY, { variables: { id: props.id } })
  return <div>{item.title}</div>
}

export default Item
