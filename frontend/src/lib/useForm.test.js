import React from 'react'
import { render, fireEvent, wait } from 'react-testing-library'
import userEvent from 'user-event'
import useForm from './useForm'

function Form() {
  const [{ text, number, checkbox }, onChange] = useForm({
    text: '',
    number: 0,
    checkbox: false,
  })
  return (
    <form data-testid="form">
      <input
        type="text"
        name="text"
        data-testid="text"
        value={text}
        onChange={onChange}
      />
      <input
        type="number"
        data-testid="number"
        name="number"
        value={number}
        onChange={onChange}
      />
      <input
        type="checkbox"
        data-testid="checkbox"
        name="checkbox"
        checked={checkbox}
        onChange={onChange}
      />
    </form>
  )
}

test('useForm works for inputs', () => {
  const values = { text: 'test', number: 1234, checkbox: true }
  const { getByTestId } = render(<Form />)
  const textInput = getByTestId('text')
  const numberInput = getByTestId('number')
  const checkboxInput = getByTestId('checkbox')
  userEvent.type(textInput, values.text)
  userEvent.type(numberInput, values.number.toString())
  userEvent.click(checkboxInput)

  expect(getByTestId('form')).toHaveFormValues({ ...values })
})
