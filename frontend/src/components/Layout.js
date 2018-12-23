/** @jsx jsx */
import { jsx, css } from '@emotion/core'

const styles = {
  layout: css`
    padding: 1rem;
  `,
}

function Layout(props) {
  return <div css={styles.layout} {...props} />
}

export default Layout
