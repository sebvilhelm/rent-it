import React, { createContext, useContext } from 'react'
import { useQuery, useMutation } from 'react-apollo-hooks'
import gql from 'graphql-tag'

const FRAGMENT_USER_INFO = gql`
  fragment userInfo on User {
    id
    name
    image {
      full
      preview
    }
  }
`
const MUTATION_SIGNIN = gql`
  mutation signIn($email: String!, $password: String!) {
    signIn(email: $email, password: $password) {
      ...userInfo
    }
  }
  ${FRAGMENT_USER_INFO}
`

const MUTATION_SIGNOUT = gql`
  mutation signOut {
    signOut {
      message
    }
  }
`

const MUTATION_SIGNUP = gql`
  mutation signUp(
    $name: String!
    $email: String!
    $password: String!
    $imageFull: String
    $imagePreview: String
  ) {
    signUp(
      name: $name
      email: $email
      password: $password
      imageFull: $imageFull
      imagePreview: $imagePreview
    ) {
      ...userInfo
    }
  }
  ${FRAGMENT_USER_INFO}
`

const QUERY_CURRENT_USER = gql`
  query currentUser {
    me {
      ...userInfo
    }
  }
  ${FRAGMENT_USER_INFO}
`

export const userContext = createContext({ user: undefined })

export const useUser = () => useContext(userContext)

const User = {}

function UserProvider(props) {
  const {
    data: { me },
  } = useQuery(QUERY_CURRENT_USER, { errorPolicy: 'ignore' })
  const signUpMutation = useMutation(MUTATION_SIGNUP)
  const signInMutation = useMutation(MUTATION_SIGNIN)
  const signOutMutation = useMutation(MUTATION_SIGNOUT)

  const signIn = async ({ email, password }) => {
    await signInMutation({
      variables: { email, password },
      update: (cache, { data: { signIn } }) => {
        cache.writeQuery({
          query: QUERY_CURRENT_USER,
          data: { me: signIn },
        })
      },
    })
  }

  const signOut = async () => {
    await signOutMutation({
      update: cache => {
        cache.writeQuery({
          query: QUERY_CURRENT_USER,
          data: { me: null },
        })
      },
    })
  }

  const signUp = async ({ email, name, password, imageFull, imagePreview }) => {
    await signUpMutation({
      variables: { email, password, name, imageFull, imagePreview },
      update: (cache, { data: { signUp } }) => {
        cache.writeQuery({
          query: QUERY_CURRENT_USER,
          data: { me: signUp },
        })
      },
    })
  }

  return (
    <userContext.Provider
      {...props}
      value={{ user: me, signIn, signOut, signUp }}
    />
  )
}

User.Provider = UserProvider
User.Consumer = userContext.Consumer

export default User
export {
  QUERY_CURRENT_USER,
  MUTATION_SIGNUP,
  MUTATION_SIGNIN,
  MUTATION_SIGNOUT,
}
