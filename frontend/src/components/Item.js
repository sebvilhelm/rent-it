/** @jsx jsx */
import { Suspense } from 'react'
import { jsx, css } from '@emotion/core'
import { useQuery } from 'react-apollo-hooks'
import graphql from 'graphql-tag'
import { Img } from 'the-platform'
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
      image {
        full
        preview
      }
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
  image: css`
    max-width: 1000px;
    width: 100%;
    height: 500px;
    object-fit: cover;
  `,
}

function AverageRating(props) {
  const { averageRating } = props
  return (
    <span>
      <strong>{averageRating.toFixed(1)}</strong> out of 5
    </span>
  )
}

function Item(props) {
  const {
    data: { item },
  } = useQuery(ITEM_QUERY, { variables: { id: props.id } })

  return (
    <div>
      {item.image && (
        <Suspense
          maxDuration={100}
          fallback={<img src={item.image.preview} alt="" css={styles.image} />}
        >
          <Img src={item.image.full} alt="" css={styles.image} />
        </Suspense>
      )}
      <h1>{item.title}</h1>
      {item.averageRating && (
        <AverageRating averageRating={item.averageRating} />
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
