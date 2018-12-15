import React, { useState } from 'react'
import { navigate } from '@reach/router'
import useInput from '../lib/useInput'
import Button from './elements/Button'
import { Form, Fieldset, Label, Input } from './elements/Form'
import { useUser } from './User'

function LoginForm() {
  const { signIn } = useUser()
  const [email, onChangeEmail] = useInput('')
  const [password, onChangePassword] = useInput('')
  const [busy, setBusy] = useState(false)

  return (
    <Form
      onSubmit={async event => {
        event.preventDefault()
        setBusy(true)
        try {
          await signIn({ email, password })
          // TODO: navigate somewhere
          navigate('/')
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
