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
      reviews {
        reviewer {
          name
        }
        rating {
          stars
          description
        }
      }
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
      <h3>Reviews</h3>
      {item.reviews.length ? (
        item.reviews.map(review => {
          const { reviewer, rating } = review
          return (
            <div>
              <span>{reviewer.name}</span>
              <p>{rating.stars} out of 5</p>
              <p>{rating.description}</p>
            </div>
          )
        })
      ) : (
        <p>This item hasn't been reviewed yet</p>
      )}
    </div>
  )
}

export default Item
