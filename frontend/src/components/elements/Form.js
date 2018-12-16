/** @jsx jsx */
import { jsx, css } from '@emotion/core'

const styles = {
  input: css({ width: '100%' }),
  label: css``,
  form: css`
    padding: 1rem;
    max-width: 40rem;
  `,
  fieldset: css`
    padding: 0;
    margin: 0;
    border: none;
  `,
}

export const Input = props => <input css={styles.input} {...props} />
export const Textarea = props => <textarea css={styles.input} {...props} />
export const Label = props => <label css={styles.label} {...props} />
export const Form = props => <form css={styles.form} {...props} />

export const Fieldset = props => <fieldset css={styles.fieldset} {...props} />
