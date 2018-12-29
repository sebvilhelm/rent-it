/** @jsx jsx */
import { Fragment, Suspense, useState } from 'react'
import { jsx, css } from '@emotion/core'
import { Link } from '@reach/router'
import { Img } from 'the-platform'
import formatPrice from '../lib/formatPrice'
import { useUser } from './User'

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
    height: 100%;
    width: 100%;
    object-fit: cover;
  `,
  imageContainer: css`
    position: relative;
    height: 180px;
  `,
  contentContainer: css`
    padding: 0.5rem 1rem;
  `,
  ownerLabel: css`
    position: absolute;
    bottom: 0;
    right: 0;
    padding: 0 1rem;
    font-size: 0.8rem;
    background: #898989;
    color: #ffffff;
    line-height: 2;
    border-radius: 6px 0 0 0;
  `,
  emphasis: css`
    font-size: 1.1em;
    font-weight: 600;
  `,
}

function AverageRating(props) {
  const { rating } = props
  return (
    <p {...props}>
      <Strong>{rating.toFixed(1)}</Strong> out of <Strong>5</Strong>
    </p>
  )
}

function Strong(props) {
  return <span css={styles.emphasis} {...props} />
}

function ItemCard(props) {
  const { user } = useUser()
  const [hovered, setHovered] = useState(false)
  const { item } = props
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      css={[styles.card, hovered && styles.cardHovered]}
    >
      <Link css={styles.link} to={`/item/${item.id}`}>
        <div css={styles.imageContainer}>
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
          {user && user.id === item.owner.id && (
            <div css={styles.ownerLabel}>Your own item</div>
          )}
        </div>
        <div css={styles.contentContainer}>
          <h2
            css={[
              styles.title,
              css`
                margin-bottom: 0.5rem;
              `,
            ]}
          >
            {item.title}
          </h2>
          {item.averageRating ? (
            <AverageRating css={styles.rating} rating={item.averageRating} />
          ) : (
            <p css={styles.rating}>No ratings yet</p>
          )}
          <div
            css={css`
              margin-bottom: 0.25rem;
            `}
          />
          <p>
            Rent for{' '}
            {item.maxDuration ? (
              <Fragment>
                up to <Strong>{item.maxDuration}</Strong> days
              </Fragment>
            ) : (
              "as long as you'd like"
            )}
            <br />
            for <Strong>{formatPrice(item.price)}</Strong> / day
          </p>
          <div
            css={css`
              margin-bottom: 0.5rem;
            `}
          />
        </div>
      </Link>
    </div>
  )
}

function MyItemCard(props) {
  const [hovered, setHovered] = useState(false)
  const { item } = props
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      css={[styles.card, hovered && styles.cardHovered]}
    >
      <Link css={styles.link} to={`/profile/item/${item.id}`}>
        <div css={styles.imageContainer}>
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
        </div>
        <div css={styles.contentContainer}>
          <h2
            css={[
              styles.title,
              css`
                margin-bottom: 0.5rem;
              `,
            ]}
          >
            {item.title}
          </h2>
          {item.averageRating ? (
            <AverageRating css={styles.rating} rating={item.averageRating} />
          ) : (
            <p css={styles.rating}>No ratings yet</p>
          )}
          <div
            css={css`
              margin-bottom: 0.25rem;
            `}
          />
          {item.bookings.length ? (
            <p>{item.bookings.length} pending bookings</p>
          ) : (
            <p>No pending bookings</p>
          )}
          <div
            css={css`
              margin-bottom: 0.5rem;
            `}
          />
        </div>
      </Link>
    </div>
  )
}

export default ItemCard
export { MyItemCard }
