import React, { Fragment, useState } from 'react'
import { useQuery, useMutation } from 'react-apollo-hooks'
import graphql from 'graphql-tag'
import { QUERY_CURRENT_USER } from './User'
import ErrorHandler from './ErrorHandler'
import { Form, Input, Label, Fieldset } from './elements/Form'
import Button from './elements/Button'
import useInput from '../lib/useInput'
import Layout from './Layout'

const QUERY_PROFILE = graphql`
  query profile {
    me {
      id
      name
      email
    }
  }
`

function Profile() {
  const [editing, setEditing] = useState(false)
  const {
    data: { me },
  } = useQuery(QUERY_PROFILE)

  return (
    <Layout>
      <section>
        <h1>{editing ? 'Edit your profile' : `Welcome, ${me.name}`}</h1>
        <Button transparent small onClick={() => setEditing(!editing)}>
          {editing ? 'Cancel edit' : 'Edit'}
        </Button>
        {editing ? (
          <Fragment>
            <EditProfileForm profile={me} />
          </Fragment>
        ) : (
          <Fragment>
            <p>
              Your email is: <strong>{me.email}</strong>
            </p>
          </Fragment>
        )}
      </section>
    </Layout>
  )
}

const MUTATION_UPDATE_PROFILE = graphql`
  mutation updateProfile($name: String, $email: String, $password: String) {
    updateProfile(name: $name, email: $email, password: $password) {
      id
    }
  }
`

function EditProfileForm(props) {
  const { profile } = props
  const [name, onChangeName] = useInput(profile.name)
  const [email, onChangeEmail] = useInput(profile.email)
  const [password, onChangePassword, setPassword] = useInput('')
  const [
    passwordConfirm,
    onChangePasswordConfirm,
    setPasswordConfirm,
  ] = useInput('')

  const updateProfile = useMutation(MUTATION_UPDATE_PROFILE, {
    refetchQueries: [
      {
        query: QUERY_CURRENT_USER,
      },
      {
        query: QUERY_PROFILE,
      },
    ],
  })

  const [busy, setBusy] = useState(false)
  const [error, setError] = useState(null)
  return (
    <Form
      onSubmit={async event => {
        event.preventDefault()
        setBusy(true)
        try {
          let variables = {}
          if (
            name === profile.name &&
            email === profile.email &&
            !password &&
            !passwordConfirm
          ) {
            throw new Error('The fields are unchanged')
          }

          if (name !== profile.name) {
            variables.name = name
          }

          if (email !== profile.email) {
            variables.email = email
          }

          if (password !== passwordConfirm) {
            setPassword('')
            setPasswordConfirm('')
            throw new Error("The passwords doesn't match")
          }

          if (password) {
            variables.password = password
          }

          await updateProfile({ variables })
          console.log('Sucess!')
        } catch (error) {
          setError(error)
        } finally {
          setBusy(false)
        }
      }}
    >
      <ErrorHandler error={error} />
      <Fieldset disabled={busy}>
        <Label htmlFor="name">
          Name
          <Input
            value={name}
            onChange={onChangeName}
            type="text"
            id="name"
            name="name"
          />
        </Label>
        <Label htmlFor="email">
          Email
          <Input
            value={email}
            onChange={onChangeEmail}
            type="email"
            id="email"
            name="email"
          />
        </Label>
        <Label htmlFor="password">
          Password
          <Input
            value={password}
            onChange={onChangePassword}
            type="password"
            id="password"
            name="password"
          />
        </Label>
        <Label htmlFor="passwordConrim">
          Confirm Password
          <Input
            value={passwordConfirm}
            onChange={onChangePasswordConfirm}
            type="password"
            id="passwordConfirm"
            name="passwordConfirm"
          />
        </Label>
        <Button>Submit</Button>
      </Fieldset>
    </Form>
  )
}

export default Profile
