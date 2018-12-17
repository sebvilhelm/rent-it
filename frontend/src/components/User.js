import React, { createContext, useContext, useState, useEffect } from 'react'
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
  mutation signUp($name: String!, $email: String!, $password: String!) {
    signUp(name: $name, email: $email, password: $password) {
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

const userContext = createContext({ user: undefined })

export const useUser = () => useContext(userContext)

const User = {}

function Provider(props) {
  const [user, setUser] = useState(undefined)
  const signUpMutation = useMutation(MUTATION_SIGNUP)
  const signInMutation = useMutation(MUTATION_SIGNIN)
  const signOutMutation = useMutation(MUTATION_SIGNOUT)

  const {
    data: { me },
  } = useQuery(QUERY_CURRENT_USER, { errorPolicy: 'ignore' })

  useEffect(
    () => {
      if (me) {
        setUser(me)
      }
    },
    [me]
  )

  const signIn = async ({ email, password }) => {
    const { data } = await signInMutation({ variables: { email, password } })
    setUser(data.signIn)
  }

  const signOut = async () => {
    await signOutMutation()
    setUser(undefined)
  }

  const signUp = async ({ email, name, password }) => {
    const { data } = await signUpMutation({
      variables: { email, password, name },
    })
    setUser(data.signUp)
  }

  return (
    <userContext.Provider
      {...props}
      value={{ user, setUser, signIn, signOut, signUp }}
    />
  )
}

User.Provider = Provider
User.Consumer = userContext.Consumer

export default User
