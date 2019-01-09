import React from 'react'
import { render, waitForElement, fireEvent } from 'react-testing-library'
import Header from './Header'
import { userContext } from './User'

describe('<Header />', () => {
  it('renders for unauthenticated users', () => {
    const { getByText } = render(<Header />)
    expect(getByText(/Sign in/i)).toBeInTheDocument()
  })

  it('renders for authenticated users', () => {
    const { getByText } = render(
      <userContext.Provider
        value={{ user: { id: 'abc123', name: 'Sebastian Nielsen' } }}
      >
        <Header />
      </userContext.Provider>
    )

    expect(getByText(/profile/i)).toBeInTheDocument()
    expect(getByText(/add item/i)).toBeInTheDocument()
    expect(getByText(/Dashboard/i)).toBeInTheDocument()
  })

  it('opens and closes dropdown when profile button is clicked', async () => {
    const { getByText, getByLabelText, container } = render(
      <userContext.Provider
        value={{ user: { id: 'abc123', name: 'Sebastian Nielsen' } }}
      >
        <Header />
      </userContext.Provider>
    )

    const profileButton = getByText(/Profile/i)
    fireEvent.click(profileButton)
    await waitForElement(() => expect(getByLabelText('profile-dropdown')), {
      container,
    })
    fireEvent.click(profileButton)
    expect(
      container.querySelector('[aria-label="profile-dropdown"]')
    ).not.toBeInTheDocument()
  })
})
