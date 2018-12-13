/** @jsx jsx */
import { jsx, css } from '@emotion/core'
import { Link } from '@reach/router'

const buttonStyle = css({
  padding: '0.5rem 1rem',
})

const Button = props => <button css={buttonStyle} {...props} />

const ButtonLink = props => <Link css={buttonStyle} {...props} />

export default Button
export { ButtonLink }
