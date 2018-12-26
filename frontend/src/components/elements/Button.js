/** @jsx jsx */
import { jsx, css } from '@emotion/core'

const styles = {
  button: css`
    --button-color: #22a3bb;
    --text-color: #edffff;
    cursor: pointer;
    background-color: var(--button-color);
    color: var(--text-color);
    padding: 0.3rem 0.5rem;
    border-radius: 3px;
    font-size: 0.8rem;
    border: 3px solid var(--button-color);
    min-width: 5rem;
    line-height: 1;
  `,
  green: css`
    --button-color: #3d9951;
    --text-color: #fcfff5;
  `,
  red: css`
    --button-color: #993d3d;
    --text-color: #fff5f9;
  `,
  grey: css`
    --button-color: #898989;
    --text-color: #ffffff;
  `,
  transparent: css`
    background-color: transparent;
    color: var(--button-color);
  `,
  unstyled: css`
    --text-color: #22a3bb;
    cursor: pointer;
    font-size: 1rem;
    background: none;
    border: none;
    padding: 0;
    -webkit-appearance: none;
    color: var(--text-color);
  `,
}

const Button = ({ transparent, ...props }) => (
  <button css={[styles.button, transparent && styles.transparent]} {...props} />
)

const UnstyledButton = props => <button css={styles.unstyled} {...props} />

export default function({ color, ...props }) {
  switch (color) {
    case 'green':
      return <Button css={styles.green} {...props} />
    case 'red':
      return <Button css={styles.red} {...props} />
    case 'grey':
      return <Button css={styles.grey} {...props} />
    default:
      return <Button {...props} />
  }
}

export { UnstyledButton }
