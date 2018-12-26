/** @jsx jsx */
import { Suspense, useState } from 'react'
import { jsx, css } from '@emotion/core'
import { Img } from 'the-platform'
import { differenceInCalendarDays, format } from 'date-fns'
import formatPrice from '../lib/formatPrice'
import ReviewItem from './ReviewItem'
import { UnstyledButton } from './elements/Button'

const styles = {
  card: css`
    position: relative;
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
    height: 250px;
  `,
  contentContainer: css`
    padding: 0.5rem 1rem;
  `,
  status: css`
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
  statusGreen: css`
    background: #3d9951;
    color: #fcfff5;
  `,
  statusRed: css`
    background: #993d3d;
    color: #fff5f9;
  `,
  reviewContainer: css`
    position: absolute;
    width: 100%;
    left: 0;
    top: 100%;
    padding: 1rem;
    background-color: white;
    box-shadow: 2px 2px 35px hsla(0, 0%, 0%, 0.05),
      2px 2px 20px hsla(0, 0%, 0%, 0.1);
  `,
  price: css`
    font-size: 1.5em;
    font-weight: 600;
  `,
}

function Status({ type, ...props }) {
  switch (type) {
    case 'APPROVED':
      return <div css={[styles.status, styles.statusGreen]}>Approved</div>
    case 'CANCELLED':
      return <div css={[styles.status, styles.statusRed]}>Cancelled</div>
    case 'DENIED':
      return <div css={[styles.status, styles.statusRed]}>Denied</div>
    default:
      return <div css={styles.status}>Pending</div>
  }
}

function BookingCard(props) {
  const [hovered, setHovered] = useState(false)
  const [review, setReview] = useState(false)
  const { item, payment, status, startDate, endDate } = props.booking
  const duration = differenceInCalendarDays(endDate, startDate)
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      css={styles.card}
    >
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
        <Status type={status} />
      </div>
      <div css={styles.contentContainer}>
        <h2 css={styles.title}>{item.title}</h2>
        <p>
          Renting for <strong>{duration}</strong> day
          {duration > 1 && 's'}
        </p>
        <p
          css={css`
            text-indent: 2rem;
          `}
        >
          <time>{format(startDate, 'DD/MM/YY')}</time> –{' '}
          <time>{format(endDate, 'DD/MM/YY')}</time>
        </p>
        <p>
          For <span css={styles.price}>{formatPrice(payment.price)}</span>
        </p>
        <div
          css={css`
            border-bottom: 1px solid #eeeeee;
            margin: 1rem 0 0.5rem;
          `}
        />
        <UnstyledButton
          style={{ marginBottom: '1rem', width: '100%' }}
          onClick={() => setReview(review => !review)}
        >
          Review
        </UnstyledButton>
        {review && (
          <div css={styles.reviewContainer}>
            <ReviewItem id={item.id} />
          </div>
        )}
      </div>
    </div>
  )
}

export default BookingCard
