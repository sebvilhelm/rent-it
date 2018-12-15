/** @jsx jsx */
import { jsx, css } from '@emotion/core'
import { lazy, Fragment, Suspense } from 'react'
import { Router } from '@reach/router'
import SpacerGif from './components/SpacerGif'
import Spinner from './components/Spinner'
import { ButtonLink } from './components/elements/Button'

const Item = lazy(() => import('./components/Item'))
const Categories = lazy(() => import('./components/Categories'))
const Category = lazy(() => import('./components/Category'))
const AddItem = lazy(() => import('./components/AddItem'))
const SignIn = lazy(() => import('./components/SignIn'))
// import Search from './components/Search'

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
            <SignIn path="sign-in" />
          </Router>
        </Suspense>
      </Suspense>
    </Fragment>
  )
}

export default App
