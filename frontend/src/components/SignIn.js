import React, { useState } from 'react'
import { useMutation } from 'react-apollo-hooks'
import graphql from 'graphql-tag'
import useInput from '../lib/useInput'
import Button from './elements/Button'
import { Form, Fieldset, Label, Input } from './elements/Form'
import { useUser } from './User'

const MUTATION_SIGNIN = graphql`
  mutation signIn($email: String!, $password: String!) {
    signIn(email: $email, password: $password) {
      name
    }
  }
`

function LoginForm() {
  const { setUser } = useUser()
  const [email, onChangeEmail] = useInput('')
  const [password, onChangePassword] = useInput('')
  const [busy, setBusy] = useState(false)
  const signIn = useMutation(MUTATION_SIGNIN, {
    variables: { email, password },
  })
  return (
    <Form
      onSubmit={async event => {
        event.preventDefault()
        setBusy(true)
        try {
          const { data } = await signIn()
          setUser(data.signIn)
        } finally {
          setBusy(false)
        }
      }}
    >
      <Fieldset disabled={busy}>
        <Label htmlFor="email">
          Email
          <Input
            value={email}
            onChange={onChangeEmail}
            id="email"
            type="email"
            required
          />
        </Label>
        <Label htmlFor="password">
          Password
          <Input
            value={password}
            onChange={onChangePassword}
            id="password"
            type="password"
            required
          />
        </Label>
        <Button>Sign in</Button>
      </Fieldset>
    </Form>
  )
}

function SignIn() {
  return (
    <div>
      <LoginForm />
    </div>
  )
}

export default SignIn
