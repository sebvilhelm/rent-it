/** @jsx jsx */
import { jsx, css, keyframes } from '@emotion/core'

const spin = keyframes`
  from { transform: rotate(0) }
  to { transform: rotate(1turn) }
`

const animation = css({
  animation: `${spin} 1s infinite linear`,
})

function Spinner() {
  return <div css={[{ display: 'inline-block' }]}>Loading...</div>
}

export default Spinner
