import React from 'react'
import { render, fireEvent, wait, waitForElement } from 'react-testing-library'
import SignUp from './SignUp'
import { userContext } from './User'
import { fakeUser } from '../lib/testingUtils'

function setup(signUpMock) {
  return render(
    <userContext.Provider value={{ signUp: signUpMock }}>
      <SignUp />
    </userContext.Provider>
  )
}

describe('<SignUp />', () => {
  it('renders and matches snapshot', () => {
    const signUp = jest.fn()
    const { container } = setup(signUp)
    expect(container.querySelector('form')).toHaveFormValues({
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    })
    expect(container.querySelector('button').textContent).toMatch(/submit/i)
    expect(container).toMatchSnapshot()
  })

  it('can be submitted with data', async () => {
    const signUp = jest.fn()
    const user = fakeUser({ password: 'hunter1' })
    const { container, getByText, getByLabelText } = setup(signUp)

    const nameInput = getByLabelText(/name/i)
    const emailInput = getByLabelText(/email/i)
    const passwordInput = getByLabelText(/password/i)
    const confirmPasswordInput = getByLabelText(/Confirm password/i)

    // Fields are empty
    expect(container.querySelector('form')).toHaveFormValues({
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    })

    // Fields are filled
    fireEvent.change(nameInput, { target: { value: user.name } })
    fireEvent.change(emailInput, {
      target: { value: user.email },
    })
    fireEvent.change(passwordInput, {
      target: { value: user.password },
    })
    fireEvent.change(confirmPasswordInput, {
      target: { value: user.password },
    })
    expect(container.querySelector('form')).toHaveFormValues({
      name: user.name,
      email: user.email,
      password: user.password,
      confirmPassword: user.password,
    })

    // Fields are disabled when button is clicked
    fireEvent.click(getByText(/submit/i))
    expect(nameInput).toBeDisabled()
    expect(emailInput).toBeDisabled()
    expect(passwordInput).toBeDisabled()
    expect(confirmPasswordInput).toBeDisabled()

    // signUp function is called with the input values
    await wait()
    expect(signUp).toHaveBeenCalledWith({
      name: user.name,
      email: user.email,
      password: user.password,
      imageFull: null,
      imagePreview: null,
    })
    expect(signUp).toHaveBeenCalledTimes(1)

    // Fields are reset and enabled
    expect(container.querySelector('form')).toHaveFormValues({
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    })
    expect(nameInput).not.toBeDisabled()
    expect(emailInput).not.toBeDisabled()
    expect(passwordInput).not.toBeDisabled()
    expect(confirmPasswordInput).not.toBeDisabled()
  })

  it('will not submit if the confirmPassword does not match the password', async () => {
    const signUp = jest.fn()
    const user = fakeUser({ password: 'hunter1' })
    const { container, getByText, getByLabelText } = setup(signUp)

    const nameInput = getByLabelText(/name/i)
    const emailInput = getByLabelText(/email/i)
    const passwordInput = getByLabelText(/password/i)
    const confirmPasswordInput = getByLabelText(/Confirm password/i)

    fireEvent.change(nameInput, { target: { value: user.name } })
    fireEvent.change(emailInput, {
      target: { value: user.email },
    })
    fireEvent.change(passwordInput, {
      target: { value: user.password },
    })
    fireEvent.change(confirmPasswordInput, {
      target: { value: 'wrongpassword' },
    })
    expect(container.querySelector('form')).toHaveFormValues({
      name: user.name,
      email: user.email,
      password: user.password,
      confirmPassword: 'wrongpassword',
    })

    fireEvent.submit(container.querySelector('form'))
    await waitForElement(() => getByText(/The two password doesn't match!/i), {
      container,
    })
    expect(signUp).not.toHaveBeenCalled()
  })

  it('render errors', async () => {
    const signUp = jest
      .fn()
      .mockRejectedValue({ message: 'Mocked error message' })
    const { container, getByText, debug } = setup(signUp)
    fireEvent.submit(container.querySelector('form'))
    expect(signUp).toHaveBeenCalled()
    await waitForElement(() => getByText(/Error/i), { container })
    expect(getByText(/Mocked error message/i)).toBeInTheDocument()
  })
})
