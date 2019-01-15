/** @jsx jsx */
import { Suspense, useEffect } from 'react'
import { jsx, css } from '@emotion/core'
import { useQuery } from 'react-apollo-hooks'
import graphql from 'graphql-tag'
import { Img, useMedia } from 'the-platform'
import formatPrice from '../lib/formatPrice'
import AddBooking from './AddBooking'
import Layout from './Layout'
import { siteMeta } from '../config'

function Item({ id, ...props }) {
  const large = useMedia({ minWidth: 720 })

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
      <section css={[large && styles.grid]}>
        {item.image && (
          <Suspense
            maxDuration={100}
            fallback={
              <img
                src={item.image.preview}
                alt={item.title}
                css={[
                  styles.image,
                  css`
                    grid-area: image;
                  `,
                ]}
              />
            }
          >
            <Img
              src={item.image.full}
              alt={item.title}
              css={[
                styles.image,
                css`
                  grid-area: image;
                `,
              ]}
            />
          </Suspense>
        )}
        <div css={styles.info}>
          <h1
            css={[
              styles.title,
              css`
                margin-bottom: 1rem;
              `,
            ]}
          >
            {item.title}
          </h1>
          {item.averageRating && (
            <AverageRating averageRating={item.averageRating} />
          )}
          <p>{item.description}</p>
          <p>Price: {formatPrice(item.price)}</p>
        </div>
        <AddBooking css={styles.form} id={props.id} />
        <div css={styles.reviews}>
          <h2>Reviews</h2>

          {item.reviews.length ? (
            <div css={styles.reviewGrid}>
              {item.reviews.map(review => {
                return <ReviewCard key={review.id} review={review} />
              })}
            </div>
          ) : (
            <p>This item hasn't been reviewed yet</p>
          )}
        </div>
      </section>
    </Layout>
  )
}

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
          image {
            preview
            full
          }
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
    grid-template-columns: 50ex 1fr 1fr;
    grid-template-areas:
      'image image form'
      'info info empty'
      'reviews reviews reviews';
  `,
  title: css``,
  info: css`
    grid-area: info;
  `,
  form: css`
    position: sticky;
    top: 10px;
    box-shadow: 2px 2px 35px hsla(0, 0%, 0%, 0.05),
      2px 2px 20px hsla(0, 0%, 0%, 0.1);
    grid-area: form;
  `,
  reviews: css`
    grid-area: reviews;
  `,
  reviewGrid: css`
    display: grid;
    grid-template-columns: minmax(auto, 600px);
    gap: 1rem;
  `,
  image: css`
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

const cardStyles = {
  card: css`
    background-color: white;
    box-shadow: 2px 2px 35px hsla(0, 0%, 0%, 0.05),
      2px 2px 20px hsla(0, 0%, 0%, 0.1);
    z-index: 1;
    padding: 1rem;
    display: grid;
    grid-template-columns: auto 1fr;
    column-gap: 1rem;
    align-items: center;
    grid-template-areas:
      'image name'
      'image rating'
      'empty description';
  `,
  image: css`
    width: 50px;
    height: 50px;
    object-fit: cover;
    border-radius: 50%;
    grid-area: image;
  `,
  name: css`
    font-size: 1.2rem;
    font-weight: 300;
    letter-spacing: 1px;
    color: #22a3bb;
    grid-area: name;
  `,
  rating: css`
    grid-area: rating;
    font-weight: 600;
  `,
  description: css`
    grid-area: description;
  `,
}

function ReviewCard(props) {
  const { reviewer, rating } = props.review
  return (
    <div css={cardStyles.card}>
      <span css={cardStyles.name}>{reviewer.name}</span>
      {reviewer.image && (
        <Suspense
          maxDuration={0}
          fallback={
            <img
              src={reviewer.image.preview}
              alt={reviewer.name}
              css={cardStyles.image}
            />
          }
        >
          <Img
            src={reviewer.image.full}
            alt={reviewer.name}
            css={cardStyles.image}
          />
        </Suspense>
      )}
      <p css={cardStyles.rating}>{rating.stars} out of 5</p>
      <p css={cardStyles.description}>{rating.description}</p>
    </div>
  )
}

export default Item
export { ITEM_QUERY }
