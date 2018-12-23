/** @jsx jsx */
import { jsx, css } from '@emotion/core'

const styles = {
  input: css`
    border: 0;
    background: #f5f5f5;
    padding: 0.5rem;
    width: 100%;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto',
      'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans',
      'Helvetica Neue', sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    font-size: 0.9rem;
    font-weight: 600;
    &::placeholder {
      color: #7d7f80;
    }
  `,
  label: css`
    font-size: 0.9rem;
    letter-spacing: 2px;
    display: inline-flex;
    width: 100%;
    flex-direction: column;
    margin: 0.5rem 0;
  `,
  form: css`
    padding: 1rem 0;
    max-width: 40rem;
  `,
  fieldset: css`
    padding: 0;
    margin: 0;
    border: none;
    &:disabled {
      opacity: 0.5;
    }
  `,
}

export const Input = props => <input css={styles.input} {...props} />
export const Textarea = props => <textarea css={styles.input} {...props} />
export const Label = props => <label css={styles.label} {...props} />
export const Form = props => <form css={styles.form} {...props} />

export const Fieldset = props => <fieldset css={styles.fieldset} {...props} />
