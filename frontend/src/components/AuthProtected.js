import React, { lazy } from 'react'
import { useUser } from './User'
import Layout from './Layout'

const SignIn = lazy(() => import('./SignIn'))

function AuthProtected(props) {
  const { user } = useUser()
  if (!user) {
    return (
      <Layout>
        <h1>You need to sign in to see this</h1>
        <SignIn />
      </Layout>
    )
  }

  return props.children
}

export default AuthProtected
