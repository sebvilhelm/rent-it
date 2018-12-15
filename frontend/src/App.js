/** @jsx jsx */
import { jsx, css } from '@emotion/core'
import { lazy, Suspense, Fragment } from 'react'
import { Router } from '@reach/router'
import Spinner from './components/Spinner'
import Header from './components/Header'
import User from './components/User'

const Item = lazy(() => import('./components/Item'))
const Categories = lazy(() => import('./components/Categories'))
const Category = lazy(() => import('./components/Category'))
const AddItem = lazy(() => import('./components/AddItem'))
const SignIn = lazy(() => import('./components/SignIn'))
// import Search from './components/Search'

function App() {
  return (
    <Suspense fallback={<Spinner />}>
      <User.Provider>
        <Fragment>
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
        </Fragment>
      </User.Provider>
    </Suspense>
  )
}

export default App
