import React, { createContext, useContext } from 'react'
import { useQuery, useMutation } from 'react-apollo-hooks'
import graphql from 'graphql-tag'

const MUTATION_SIGNIN = graphql`
  mutation signIn($email: String!, $password: String!) {
    signIn(email: $email, password: $password) {
      id
      name
    }
  }
`

const MUTATION_SIGNOUT = graphql`
  mutation signOut {
    signOut {
      message
    }
  }
`

const MUTATION_SIGNUP = graphql`
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
      id
      name
    }
  }
`

const QUERY_CURRENT_USER = graphql`
  query currentUser {
    me {
      id
      name
    }
  }
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
      refetchQueries: [{ query: QUERY_CURRENT_USER }],
    })
  }

  const signOut = async () => {
    await signOutMutation({
      refetchQueries: [{ query: QUERY_CURRENT_USER }],
    })
  }

  const signUp = async ({ email, name, password, imageFull, imagePreview }) => {
    await signUpMutation({
      variables: { email, password, name, imageFull, imagePreview },
      refetchQueries: [{ query: QUERY_CURRENT_USER }],
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
