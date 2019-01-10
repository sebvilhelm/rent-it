/** @jsx jsx */
import { jsx, css } from '@emotion/core'
import { useState } from 'react'
import { Form, Label, Input, Fieldset } from './elements/Form'
import Button from './elements/Button'
import useForm from '../lib/useForm'
import ErrorHandler from './ErrorHandler'
import { useUser } from './User'

function SignUpForm() {
  const { signUp } = useUser()
  const [
    { name, email, password, confirmPassword },
    onChange,
    resetForm,
  ] = useForm({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
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
          resetForm()
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
            onChange={onChange}
            type="text"
            id="signUpName"
            name="name"
          />
        </Label>
        <Label htmlFor="signUpEmail">
          Email
          <Input
            value={email}
            onChange={onChange}
            type="email"
            id="signUpEmail"
            name="email"
          />
        </Label>
        <Label htmlFor="signUpPassword">
          Password
          <Input
            value={password}
            onChange={onChange}
            type="password"
            id="signUpPassword"
            name="password"
          />
        </Label>

        <Label htmlFor="signUpConfirmPassword">
          Confirm Password
          <Input
            value={confirmPassword}
            onChange={onChange}
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
