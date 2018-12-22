/** @jsx jsx */
import { Fragment, Suspense, useState } from 'react'
import { jsx, css } from '@emotion/core'
import { Link } from '@reach/router'
import { useQuery } from 'react-apollo-hooks'
import gql from 'graphql-tag'
import { Img, useMedia } from 'the-platform'
import formatPrice from '../lib/formatPrice'

const QUERY_ITEMS_BY_CATEGORY = gql`
  query itemsByCategory($slug: String!, $searchTerm: String) {
    category(where: { slug: $slug }) {
      title
    }
    items(
      where: {
        AND: [{ category: { slug: $slug } }, { title_contains: $searchTerm }]
      }
    ) {
      id
      title
      averageRating
      maxDuration
      price
      image {
        full
        preview
      }
    }
    itemsConnection(
      where: {
        AND: [{ category: { slug: $slug } }, { title_contains: $searchTerm }]
      }
    ) {
      aggregate {
        count
      }
    }
  }
`

const styles = {
  grid: css`
    display: grid;
    gap: 1rem;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  `,
}

function Category(props) {
  const { slug } = props

  const large = useMedia({ minWidth: 400 })

  // !: No URLSearchParams support on iOS Safari
  // !: polyfill found at https://github.com/ungap/url-search-params
  const params = new URLSearchParams(props.location.search)

  const variables = params.has('s')
    ? {
        slug,
        searchTerm: params.get('s'),
      }
    : {
        slug,
      }

  const {
    data: { items, category },
  } = useQuery(QUERY_ITEMS_BY_CATEGORY, {
    variables,
  })

  return (
    <div>
      <h1>{category.title}</h1>
      {items.length > 0 && (
        <div css={[large && styles.grid]}>
          {items.map(item => {
            return <ItemCard key={item.id} item={item} />
          })}
        </div>
      )}
    </div>
  )
}

const cardStyles = {
  card: css`
    background-color: white;
    box-shadow: 2px 2px 35px hsla(0, 0%, 0%, 0.05),
      2px 2px 20px hsla(0, 0%, 0%, 0.1);
    transition: all 300ms;
  `,
  cardHovered: css`
    box-shadow: 2px 2px 40px hsla(0, 0%, 0%, 0.05),
      2px 2px 30px hsla(0, 0%, 0%, 0.15);
    transform: translateY(-0.5rem);
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
      css={[cardStyles.card, hovered && cardStyles.cardHovered]}
    >
      <Link css={cardStyles.link} to={`/item/${item.id}`}>
        {item.image ? (
          <Suspense
            maxDuration={100}
            fallback={
              <img src={item.image.preview} alt="" css={cardStyles.image} />
            }
          >
            <Img src={item.image.full} alt="" css={cardStyles.image} />
          </Suspense>
        ) : (
          <div css={cardStyles.image}>No image...</div>
        )}
        <div css={cardStyles.contentContainer}>
          <h2 css={cardStyles.title}>{item.title}</h2>
          {item.averageRating ? (
            <AverageRating
              css={cardStyles.rating}
              rating={item.averageRating}
            />
          ) : (
            <p css={cardStyles.rating}>No ratings yet</p>
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

export default Category
