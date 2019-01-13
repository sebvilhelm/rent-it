/** @jsx jsx */
import { Suspense, useEffect } from 'react'
import { jsx, css } from '@emotion/core'
import { useQuery } from 'react-apollo-hooks'
import graphql from 'graphql-tag'
import { Img } from 'the-platform'
import formatPrice from '../lib/formatPrice'
import AddBooking from './AddBooking'
import Layout from './Layout'
import { siteMeta } from '../config'

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
    grid-template-columns: minmax(auto, 600px);
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

function Item({ id, ...props }) {
  const {
    data: { item },
  } = useQuery(ITEM_QUERY, { variables: { id: id } })

  useEffect(
    () => {
      document.title = item.title
      return () => (document.title = siteMeta.title)
    },
    [item]
  )

  return (
    <Layout>
      <section>
        {item.image && (
          <Suspense
            maxDuration={100}
            fallback={
              <img
                src={item.image.preview}
                alt={item.title}
                css={styles.image}
              />
            }
          >
            <Img src={item.image.full} alt={item.title} css={styles.image} />
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
              return <ReviewCard key={review.id} review={review} />
            })}
          </div>
        ) : (
          <p>This item hasn't been reviewed yet</p>
        )}
      </section>
    </Layout>
  )
}

const cardStyles = {
  card: css`
    background-color: white;
    box-shadow: 2px 2px 35px hsla(0, 0%, 0%, 0.05),
      2px 2px 20px hsla(0, 0%, 0%, 0.1);
    z-index: 1;
    transition: all 300ms;
    padding: 1rem;
  `,
}

function ReviewCard(props) {
  const { reviewer, rating } = props.review
  return (
    <div css={cardStyles.card}>
      <span>{reviewer.name}</span>
      <p>{rating.stars} out of 5</p>
      <p>{rating.description}</p>
    </div>
  )
}

export default Item
export { ITEM_QUERY }
