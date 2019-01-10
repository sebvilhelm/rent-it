import { useState } from 'react'

function useForm(initialValues) {
  const [form, setForm] = useState(initialValues)

  const onChange = event => {
    event.persist()
    const { name, value, type } = event.target
    setForm(prevForm => ({
      ...prevForm,
      [name]: type === 'checkbox' ? event.target.checked : value,
    }))
  }

  const reset = () => setForm(initialValues)

  return [form, onChange, reset]
}

export default useForm
