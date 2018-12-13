/** @jsx jsx */
import { jsx } from '@emotion/core'

export const Input = props => <input css={{ width: '100%' }} {...props} />
export const Textarea = props => <textarea css={{ width: '100%' }} {...props} />
export const Label = props => (
  <label css={{ marginTop: '1rem', marginBottom: '1rem' }} {...props} />
)
export const Form = props => (
  <form css={{ padding: '1rem', maxWidth: '40rem' }} {...props} />
)
