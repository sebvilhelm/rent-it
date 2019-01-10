import { useState } from 'react'

function useForm(initialValues) {
  const [form, setForm] = useState(initialValues)

  const onChange = event => {
    event.persist()
    const { name, value } = event.target
    setForm(prevForm => ({
      ...prevForm,
      [name]: value,
    }))
  }

  const reset = () => setForm(initialValues)

  return [form, onChange, reset]
}

export default useForm
