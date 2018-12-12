/** @jsx jsx */
import { jsx, css } from '@emotion/core'
import { Fragment, Suspense } from 'react'
import { Router, Link } from '@reach/router'
import { useQuery } from 'react-apollo-hooks'
import gql from 'graphql-tag'
import SpacerGif from './components/SpacerGif'
import Spinner from './components/Spinner'
import Item from './components/Item'

const query = gql`
  query testQuery {
    items {
      id
      title
    }
  }
`

function Test() {
  const {
    data: { items },
  } = useQuery(query)
  return (
    <ul>
      {items.map(item => (
        <li key={item.id}>
          <Link to={`/item/${item.id}`}>{item.title}</Link>
        </li>
      ))}
    </ul>
  )
}

function Header(props) {
  return (
    <header {...props}>
      <div css={{ display: 'flex', padding: '1rem' }}>
        <div>Logo</div>
        <SpacerGif />
        <div>
          <input type="search" />
        </div>

        <nav>
          <a href="#">Link</a>
          <a href="#">Link</a>
          <a href="#">Link</a>
          <a href="#">Link</a>
          <a href="#">Link</a>
        </nav>
      </div>
    </header>
  )
}

function App() {
  return (
    <Fragment>
      <Suspense fallback={<Spinner />}>
        <Header />
        <h1
          css={css`
            color: hotpink;
          `}
        >
          Hello
        </h1>
        <Suspense fallback={<Spinner />}>
          <Router>
            <Test path="/" />
            <Item path="item/:id" />
          </Router>
        </Suspense>
      </Suspense>
    </Fragment>
  )
}

export default App
