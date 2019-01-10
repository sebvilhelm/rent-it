import React, { Suspense } from 'react'
import { render, wait } from 'react-testing-library'
import AuthProtected from './AuthProtected'
import { userContext } from './User'
import { fakeUser } from '../lib/testingUtils'

const Child = () => <p>I'm the child</p>

describe('<AuthProtected />', () => {
  it('renders the signup form for unautherized users', async () => {
    const { getByText, getByLabelText } = render(
      <userContext.Provider value={{ user: undefined }}>
        <Suspense fallback="Loading...">
          <AuthProtected>
            <Child />
          </AuthProtected>
        </Suspense>
      </userContext.Provider>
    )
    expect(getByText(/Loading.../i)).toBeInTheDocument()
    await wait()
    expect(getByText(/You need to sign in to see this/i)).toBeInTheDocument()
    expect(getByText(/Sign in/i)).toBeInTheDocument()
    expect(getByLabelText(/Email/i)).toBeInTheDocument()
    expect(getByLabelText(/Password/i)).toBeInTheDocument()
  })

  it('renders the child for authorized users', () => {
    const { id, name } = fakeUser()
    const { getByText } = render(
      <userContext.Provider value={{ user: { name, id } }}>
        <Suspense fallback="Loading...">
          <AuthProtected>
            <Child />
          </AuthProtected>
        </Suspense>
      </userContext.Provider>
    )
    expect(getByText(/I'm the child/i)).toBeInTheDocument()
  })
})
