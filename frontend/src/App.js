/** @jsx jsx */
import { jsx, css } from '@emotion/core'
import { Fragment, Suspense } from 'react'
import { Router } from '@reach/router'
import SpacerGif from './components/SpacerGif'
import Spinner from './components/Spinner'
import Item from './components/Item'
import Category from './components/Category'
import Categories from './components/Categories'
import { ButtonLink } from './components/elements/Button'
// import Search from './components/Search'
import AddItem from './components/AddItem'

function Header(props) {
  return (
    <header {...props}>
      <div css={{ display: 'flex', padding: '1rem' }}>
        <div>Logo</div>
        <SpacerGif />
        <nav>
          <ButtonLink to="/add-item">Add Item</ButtonLink>
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
            <Categories path="/" />
            <AddItem path="add-item" />
            <Item path="item/:id" />
            <Category path="category/:slug" />
          </Router>
        </Suspense>
      </Suspense>
    </Fragment>
  )
}

export default App
