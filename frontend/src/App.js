/** @jsx jsx */
import React from 'react'
import { jsx, css } from '@emotion/core'
import { Suspense } from 'react'
import { useQuery } from 'react-apollo-hooks'
import gql from 'graphql-tag'
import SpacerGif from './components/SpacerGif'
import Spinner from './components/Spinner'

const query = gql`
  query testQuery {
    items {
      title
    }
  }
`

function C() {
  const {
    data: { items },
  } = useQuery(query)
  return (
    <ul>
      {items.map(item => (
        <li key={item.title}>{item.title}</li>
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

        <nav>link link link link</nav>
      </div>
    </header>
  )
}

function App() {
  return (
    <>
      <Suspense fallback={<Spinner />}>
        <Header />
        <h1
          css={css`
            color: hotpink;
          `}
        >
          Hello
        </h1>
        <C />
      </Suspense>
    </>
  )
}

export default App
