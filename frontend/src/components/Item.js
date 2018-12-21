/** @jsx jsx */
import { jsx, css } from '@emotion/core'
import { useQuery } from 'react-apollo-hooks'
import graphql from 'graphql-tag'
import formatPrice from '../lib/formatPrice'
import AddBooking from './AddBooking'

const ITEM_QUERY = graphql`
  query item($id: ID!) {
    item(where: { id: $id }) {
      id
      title
      description
      price
      averageRating
      reviews {
        id
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

const styles = {
  grid: css`
    display: grid;
    gap: 1rem;
  `,
}

function Item(props) {
  const {
    data: { item },
  } = useQuery(ITEM_QUERY, { variables: { id: props.id } })

  return (
    <div>
      <h1>{item.title}</h1>
      {item.averageRating && (
        <span>Average: {item.averageRating.toFixed(1)} out of 5</span>
      )}
      <p>{item.description}</p>
      <p>Price: {formatPrice(item.price)}</p>
      <AddBooking id={props.id} />
      <h3>Reviews</h3>

      {item.reviews.length ? (
        <div css={styles.grid}>
          {item.reviews.map(review => {
            const { id, reviewer, rating } = review
            return (
              <div key={id}>
                <span>{reviewer.name}</span>
                <p>{rating.stars} out of 5</p>
                <p>{rating.description}</p>
              </div>
            )
          })}
        </div>
      ) : (
        <p>This item hasn't been reviewed yet</p>
      )}
    </div>
  )
}

export default Item
