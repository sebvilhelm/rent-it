/** @jsx jsx */
import { jsx, css } from '@emotion/core'
import { useState } from 'react'
import { Form, Label, Input, Fieldset } from './elements/Form'
import Button from './elements/Button'
import useInput from '../lib/useInput'
import ErrorHandler from './Error'
import { useUser } from './User'

function SignUpForm() {
  const { signUp } = useUser()
  const [name, onChangeName, setName] = useInput('')
  const [email, onChangeEmail, setEmail] = useInput('')
  const [password, onChangePassword, setPassword] = useInput('')
  const [
    confirmPassword,
    onChangeConfirmPassword,
    setConfirmPassword,
  ] = useInput('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState(null)
  return (
    <Form
      onSubmit={async event => {
        event.preventDefault()
        setBusy(true)
        setError(null)
        try {
          if (password !== confirmPassword) {
            throw new Error("The two password doesn't match!")
          }
          await signUp({ email, password, name })
          setName('')
          setEmail('')
          setPassword('')
          setConfirmPassword('')
          // TODO: Success message
        } catch (error) {
          setError(error)
        } finally {
          setBusy(false)
        }
      }}
    >
      <Fieldset
        css={css`
          display: grid;
          gap: 1rem;
        `}
        disabled={busy}
      >
        <ErrorHandler error={error} />
        <Label htmlFor="signUpName">
          Name
          <Input
            value={name}
            onChange={onChangeName}
            type="text"
            id="signUpName"
            name="name"
          />
        </Label>
        <Label htmlFor="signUpEmail">
          Email
          <Input
            value={email}
            onChange={onChangeEmail}
            type="email"
            id="signUpEmail"
            name="email"
          />
        </Label>
        <Label htmlFor="signUpPassword">
          Password
          <Input
            value={password}
            onChange={onChangePassword}
            type="password"
            id="signUpPassword"
            name="password"
          />
        </Label>

        <Label htmlFor="signUpConfirmPassword">
          Confirm Password
          <Input
            value={confirmPassword}
            onChange={onChangeConfirmPassword}
            type="password"
            id="signUpConfirmPassword"
            name="confirmPassword"
          />
        </Label>

        <Button>Submit</Button>
      </Fieldset>
    </Form>
  )
}

function SignUp() {
  return (
    <div>
      <SignUpForm />
    </div>
  )
}

export default SignUp
export { SignUpForm }
