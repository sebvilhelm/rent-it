/** @jsx jsx */
import { Fragment, Suspense, useState } from 'react'
import { jsx, css } from '@emotion/core'
import { Link } from '@reach/router'
import { Img } from 'the-platform'
import formatPrice from '../lib/formatPrice'

const styles = {
  card: css`
    background-color: white;
    box-shadow: 2px 2px 35px hsla(0, 0%, 0%, 0.05),
      2px 2px 20px hsla(0, 0%, 0%, 0.1);
    z-index: 1;
    transition: all 300ms;
  `,
  cardHovered: css`
    box-shadow: 2px 2px 60px hsla(0, 0%, 0%, 0.07),
      2px 2px 40px hsla(0, 0%, 0%, 0.15);
    transform: translateY(-1px);
  `,
  link: css`
    color: inherit;
    text-decoration: inherit;
  `,
  title: css`
    margin-top: 0;
    margin-bottom: 0;
  `,
  rating: css`
    margin: 0;
  `,
  image: css`
    background-color: #f8f9f8;
    height: 180px;
    width: 100%;
    object-fit: cover;
  `,
  contentContainer: css`
    padding: 0.5rem 1rem;
  `,
}

function AverageRating(props) {
  const { rating } = props
  return (
    <p {...props}>
      <strong>{rating.toFixed(1)}</strong> out of 5
    </p>
  )
}

function ItemCard(props) {
  const [hovered, setHovered] = useState(false)
  const { item } = props
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      css={[styles.card, hovered && styles.cardHovered]}
    >
      <Link css={styles.link} to={`/item/${item.id}`}>
        {item.image ? (
          <Suspense
            maxDuration={100}
            fallback={
              <img src={item.image.preview} alt="" css={styles.image} />
            }
          >
            <Img src={item.image.full} alt="" css={styles.image} />
          </Suspense>
        ) : (
          <div css={styles.image}>No image...</div>
        )}
        <div css={styles.contentContainer}>
          <h2 css={styles.title}>{item.title}</h2>
          {item.averageRating ? (
            <AverageRating css={styles.rating} rating={item.averageRating} />
          ) : (
            <p css={styles.rating}>No ratings yet</p>
          )}
          <p>
            Rent for{' '}
            {item.maxDuration ? (
              <Fragment>
                up to <strong>{item.maxDuration}</strong> days
              </Fragment>
            ) : (
              "as long as you'd like"
            )}
            <br />
            for <strong>{formatPrice(item.price)}</strong> / day
          </p>
        </div>
      </Link>
    </div>
  )
}

export default ItemCard
