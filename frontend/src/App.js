/** @jsx jsx */
import { jsx, css } from '@emotion/core'
import { Suspense } from 'react'
import { useQuery } from 'react-apollo-hooks'
import gql from 'graphql-tag'

const query = gql`
  query {
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

function App() {
  return (
    <div>
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
