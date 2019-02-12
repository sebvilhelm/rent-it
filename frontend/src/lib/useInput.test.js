import React from 'react'
import { render, fireEvent } from 'react-testing-library'
import useInput from './useInput'

describe('useInput', () => {
  it('handles text inputs', () => {
    const Component = () => {
      const [value, onChange] = useInput('')
      return (
        <input
          type="text"
          aria-label="input"
          value={value}
          onChange={onChange}
        />
      )
    }

    const { getByLabelText } = render(<Component />)
    const input = getByLabelText('input')
    fireEvent.change(input, { target: { value: 'abc123' } })
    expect(input.value).toBe('abc123')
  })

  it('handles number inputs', () => {
    const Component = () => {
      const [value, onChange] = useInput(0)
      return (
        <input
          type="number"
          aria-label="input"
          value={value}
          onChange={onChange}
        />
      )
    }

    const { getByLabelText } = render(<Component />)
    const input = getByLabelText('input')
    fireEvent.change(input, { target: { value: '3' } })
    expect(input.value).toBe('3')
  })

  it('handles email inputs', () => {
    const Component = () => {
      const [value, onChange] = useInput(0)
      return (
        <input
          type="email"
          aria-label="input"
          value={value}
          onChange={onChange}
        />
      )
    }

    const { getByLabelText } = render(<Component />)
    const input = getByLabelText('input')
    fireEvent.change(input, { target: { value: 'email@example.com' } })
    expect(input.value).toBe('email@example.com')
  })
})
