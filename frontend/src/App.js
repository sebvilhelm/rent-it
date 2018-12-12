/** @jsx jsx */
import { jsx, css } from '@emotion/core'
import { Suspense } from 'react'
import { useQuery } from 'react-apollo-hooks'
import gql from 'graphql-tag'
import SpacerGif from './components/SpacerGif'

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

function Header() {
  return (
    <header>
      <div css={{ display: 'flex' }}>
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
    <div>
      <Header />
      <h1
        css={css`
          color: hotpink;
        `}
      >
        Hello
      </h1>
      <Suspense fallback={<div>Loading...</div>}>
        <C />
      </Suspense>
    </div>
  )
}

export default App
