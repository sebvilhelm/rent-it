import { useState } from 'react'

function useForm(initialValues) {
  const [form, setForm] = useState(initialValues)

  const onChange = event => {
    event.persist()
    setForm(prevForm => ({
      ...prevForm,
      [event.target.name]: event.target.value,
    }))
  }

  const reset = () => setForm(initialValues)

  return [form, onChange, reset]
}

export default useForm
