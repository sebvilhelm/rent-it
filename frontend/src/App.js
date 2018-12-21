/** @jsx jsx */
import { jsx, css } from '@emotion/core'
import { lazy, Suspense, Fragment } from 'react'
import { Router } from '@reach/router'
import Spinner from './components/Spinner'
import Header from './components/Header'
import User, { useUser } from './components/User'

const Item = lazy(() => import('./components/Item'))
const Categories = lazy(() => import('./components/Categories'))
const Category = lazy(() => import('./components/Category'))
const AddItem = lazy(() => import('./components/AddItem'))
const MyBookings = lazy(() => import('./components/MyBookings'))
const PendingBookings = lazy(() => import('./components/PendingBookings'))
const SignIn = lazy(() => import('./components/SignIn'))
const Profile = lazy(() => import('./components/Profile'))
// import Search from './components/Search'

function ProfileGate(props) {
  const { user } = useUser()
  if (!user) {
    return (
      <div>
        <h2>You need to sign in to see this</h2>
        <SignIn />
      </div>
    )
  }
  return props.children
}

function App() {
  return (
    <Suspense fallback={<Spinner />}>
      <User.Provider>
        <Fragment>
          <Header />
          <Suspense fallback={<Spinner />}>
            <Router>
              <Categories path="/" />
              <Category path="category/:slug" />
              <Item path="item/:id" />
              <AddItem path="add-item" />
              <ProfileGate path="profile">
                <MyBookings path="bookings" />
                <PendingBookings path="pending-bookings" />
                <Profile path="/" />
              </ProfileGate>
              <SignIn path="sign-in" />
            </Router>
          </Suspense>
        </Fragment>
      </User.Provider>
    </Suspense>
  )
}

export default App
