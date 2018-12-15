import React, { createContext, useContext, useState, useEffect } from 'react'
import { useQuery } from 'react-apollo-hooks'
import graphql from 'graphql-tag'

const userContext = createContext({ user: undefined })

export const useUser = () => useContext(userContext)

const User = {}

function Provider(props) {
  const [user, setUser] = useState(undefined)

  const {
    data: { me },
  } = useQuery(graphql`
    query {
      me {
        name
      }
    }
  `)

  useEffect(
    () => {
      if (me) {
        setUser(me)
      }
    },
    [me]
  )

  return <userContext.Provider {...props} value={{ user, setUser }} />
}

User.Provider = Provider
User.Consumer = userContext.Consumer

export default User
