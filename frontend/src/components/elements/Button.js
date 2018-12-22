/** @jsx jsx */
import { jsx, css } from '@emotion/core'

const styles = {
  button: css`
    background-color: #22a3bb;
    color: #edffff;
    padding: 0.3rem 0.5rem;
    border-radius: 3px;
    font-size: 0.8rem;
    border: 3px solid #22a3bb;
    min-width: 5rem;
  `,
}

const Button = props => <button css={styles.button} {...props} />

export default Button
